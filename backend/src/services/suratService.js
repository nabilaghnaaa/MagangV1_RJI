const {
  sequelize,
  Surat,
  SuratInvitation,
  SuratAssignment,
  SuratTemplate,
  Verification,
  SignatureSetting,
  OrganizationSetting,
} = require("../models");

const verificationService = require("./verificationService");
const pdfService = require("./pdfService");
const emailService = require("./emailService");

const getRomanMonth = (monthIndex) => {
  const months = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  return months[monthIndex] || "";
};

const getCurrentDate = () => {
  return new Date();
};

const generateLetterNumber = async (
  type,
  transaction
) => {
  const now = getCurrentDate();
  const year = now.getFullYear();
  const month = getRomanMonth(now.getMonth());

  const lastLetter = await Surat.findOne({
    where: {
      type,
    },
    order: [
      ["id", "DESC"],
    ],
    transaction,
    lock: transaction ? true : false,
  });

  let sequence = 1;

  if (lastLetter?.letter_number) {
    const match = lastLetter.letter_number.match(
      /^D\.10\/(\d+)\/RJI\/[IVXLCDM]+\/\d{4}$/
    );

    if (match) {
      sequence = Number(match[1]) + 1;
    }
  }

  const paddedSequence = String(sequence).padStart(4, "0");

  return `D.10/${paddedSequence}/RJI/${month}/${year}`;
};

const getActiveSignatureSetting = async (
  transaction
) => {
  return SignatureSetting.findOne({
    where: {
      is_active: true,
    },
    order: [
      ["id", "DESC"],
    ],
    transaction,
  });
};

const getActiveOrganizationSetting = async (
  transaction
) => {
  return OrganizationSetting.findOne({
    where: {
      is_active: true,
    },
    order: [
      ["id", "DESC"],
    ],
    transaction,
  });
};

const getActiveTemplate = async (
  type,
  transaction
) => {
  return SuratTemplate.findOne({
    where: {
      type,
      is_active: true,
    },
    order: [
      ["created_at", "DESC"],
    ],
    transaction,
    lock: transaction ? true : false,
  });
};

const createFromInvitation = async (
  invitationId,
  transaction
) => {
  const invitation = await SuratInvitation.findByPk(
    invitationId,
    {
      transaction,
      lock: transaction ? true : false,
    }
  );

  if (!invitation) {
    throw new Error(
      "Pengajuan surat undangan tidak ditemukan."
    );
  }

  const existing = await Surat.findOne({
    where: {
      invitation_id: invitationId,
    },
    transaction,
    lock: transaction ? true : false,
  });

  if (existing) {
    return existing;
  }

  const letterNumber = invitation.letter_number || await generateLetterNumber(
    "invitation",
    transaction
  );

  const letterDate = invitation.letter_date || getCurrentDate();

  const subject = invitation.invitation_subject || invitation.activity_name;

  const recipientName = invitation.recipient_name || invitation.participant_name;

  const recipientEmail = invitation.participant_email;

  return Surat.create(
    {
      type: "invitation",
      invitation_id: invitation.id,
      assignment_id: null,
      letter_number: letterNumber,
      letter_date: letterDate,
      subject,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      status: "issued",
      email_status: "pending",
    },
    {
      transaction,
    }
  );
};

const createFromAssignment = async (
  assignmentId,
  transaction
) => {
  const assignment = await SuratAssignment.findByPk(
    assignmentId,
    {
      transaction,
      lock: transaction ? true : false,
    }
  );

  if (!assignment) {
    throw new Error(
      "Pengajuan surat tugas tidak ditemukan."
    );
  }

  const existing = await Surat.findOne({
    where: {
      assignment_id: assignmentId,
    },
    transaction,
    lock: transaction ? true : false,
  });

  if (existing) {
    return existing;
  }

  const letterNumber = assignment.letter_number || await generateLetterNumber(
    "assignment",
    transaction
  );

  const letterDate = assignment.letter_date || getCurrentDate();

  const subject = assignment.assignment_subject || assignment.activity_name;

  const recipientName = assignment.recipient_name || assignment.member_name;

  const recipientEmail = assignment.member_email;

  return Surat.create(
    {
      type: "assignment",
      invitation_id: null,
      assignment_id: assignment.id,
      letter_number: letterNumber,
      letter_date: letterDate,
      subject,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      status: "issued",
      email_status: "pending",
    },
    {
      transaction,
    }
  );
};

const applySignatureSnapshot = async (
  surat,
  transaction
) => {
  const signatureSetting = await getActiveSignatureSetting(
    transaction
  );

  if (!signatureSetting) {
    throw new Error(
      "Konfigurasi tanda tangan aktif belum tersedia."
    );
  }

  if (
    signatureSetting.mode === "scan" &&
    !signatureSetting.signature_path
  ) {
    throw new Error(
      "File tanda tangan untuk mode scan belum tersedia."
    );
  }

  let signerName = signatureSetting.signer_name || "Dr. Arbain, Sp.Pd., M.Pd.";
  let signerPosition = signatureSetting.signer_position || "Ketua RJI";

  if (
    surat.type === "invitation" &&
    surat.invitation_id
  ) {
    const invitation = await SuratInvitation.findByPk(
      surat.invitation_id,
      {
        transaction,
      }
    );

    if (invitation?.signer_name) {
      signerName = invitation.signer_name;
    }

    if (invitation?.signer_position) {
      signerPosition = invitation.signer_position;
    }
  }

  await surat.update(
    {
      signature_type:
        signatureSetting.mode === "barcode"
          ? "barcode"
          : "manual",

      signature_mode:
        signatureSetting.mode,

      signature_name:
        signerName,

      signature_position:
        signerPosition,

      signature_path:
        signatureSetting.signature_path ||
        null,
    },
    {
      transaction,
    }
  );

  return surat;
};

const applyOrganizationSnapshot = async (
  surat,
  transaction
) => {
  const organizationSetting =
    await getActiveOrganizationSetting(
      transaction
    );

  if (!organizationSetting) {
    throw new Error(
      "Konfigurasi organisasi aktif belum tersedia."
    );
  }

  await surat.update(
    {
      organization_name:
        organizationSetting.organization_name,

      organization_short_name:
        organizationSetting.organization_short_name,

      organization_address:
        organizationSetting.address,

      organization_email:
        organizationSetting.email,

      organization_phone:
        organizationSetting.phone,

      organization_website:
        organizationSetting.website,

      organization_logo_path:
        organizationSetting.logo_path,

      letterhead_top_path:
        organizationSetting.letterhead_top_path,

      letterhead_bottom_path:
        organizationSetting.letterhead_bottom_path,
    },
    {
      transaction,
    }
  );

  return surat;
};

const applyTemplateSnapshot = async (
  surat,
  transaction
) => {
  const template = await getActiveTemplate(
    surat.type,
    transaction
  );

  if (!template) {
    throw new Error(
      `Template aktif untuk jenis surat "${surat.type}" belum tersedia.`
    );
  }

  await surat.update(
    {
      template_id:
        template.id,

      template_name:
        template.name,

      template_content:
        template.content,

      template_footer:
        null,
    },
    {
      transaction,
    }
  );

  return surat;
};

const generateDocument = async (
  suratId
) => {
  const pdf = await pdfService.generatePdf(
    suratId
  );

  let email = null;

  if (pdf) {
    email = await emailService.sendSurat(
      suratId
    );
  }

  return {
    pdf,
    email,
  };
};

const approveInvitation = async (
  invitationId,
  adminId
) => {
  const transaction =
    await sequelize.transaction();

  try {
    const invitation =
      await SuratInvitation.findByPk(
        invitationId,
        {
          transaction,
          lock: true,
        }
      );

    if (!invitation) {
      throw new Error(
        "Pengajuan surat undangan tidak ditemukan."
      );
    }

    if (
      ![
        "pending",
        "review",
      ].includes(
        invitation.status
      )
    ) {
      throw new Error(
        "Pengajuan surat undangan tidak dapat disetujui."
      );
    }

    let surat =
      await createFromInvitation(
        invitation.id,
        transaction
      );

    await invitation.update(
      {
        status:
          "approved",

        reviewed_by:
          adminId,

        reviewed_at:
          invitation.reviewed_at ||
          getCurrentDate(),

        approved_at:
          getCurrentDate(),
      },
      {
        transaction,
      }
    );

    surat =
      await applySignatureSnapshot(
        surat,
        transaction
      );

    surat =
      await applyOrganizationSnapshot(
        surat,
        transaction
      );

    surat =
      await applyTemplateSnapshot(
        surat,
        transaction
      );

    const verification =
      await verificationService.generateVerification(
        surat.id,
        transaction
      );

    await transaction.commit();

    let pdf = null;
    let pdfError = null;
    let email = null;
    let emailError = null;

    try {
      pdf =
        await pdfService.generatePdf(
          surat.id
        );
    } catch (error) {
      console.error(
        "Gagal generate PDF Surat Undangan:",
        error
      );

      pdfError =
        error.message ||
        "Gagal generate PDF.";
    }

    if (pdf && !pdfError) {
      try {
        email =
          await emailService.sendSurat(
            surat.id
          );
      } catch (error) {
        console.error(
          "Gagal mengirim email Surat Undangan:",
          error
        );

        emailError =
          error.message ||
          "Gagal mengirim email.";
      }
    }

    const latestSurat =
      await Surat.findByPk(
        surat.id,
        {
          include: [
            {
              model:
                SuratInvitation,

              as:
                "invitation",
            },

            {
              model:
                SuratAssignment,

              as:
                "assignment",
            },

            {
              model:
                Verification,

              as:
                "verification",
            },
          ],
        }
      );

    const latestInvitation =
      await SuratInvitation.findByPk(
        invitationId,
        {
          include: [
            {
              model:
                require("../models").User,

              as:
                "reviewer",

              attributes: [
                "id",
                "name",
                "email",
              ],
            },
          ],
        }
      );

    return {
      invitation:
        latestInvitation,

      surat:
        latestSurat,

      verification,

      pdf,

      pdfError,

      email,

      emailError,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};

const approveAssignment = async (
  assignmentId,
  adminId
) => {
  const transaction =
    await sequelize.transaction();

  try {
    const assignment =
      await SuratAssignment.findByPk(
        assignmentId,
        {
          transaction,
          lock: true,
        }
      );

    if (!assignment) {
      throw new Error(
        "Pengajuan surat tugas tidak ditemukan."
      );
    }

    if (
      ![
        "pending",
        "review",
      ].includes(
        assignment.status
      )
    ) {
      throw new Error(
        "Pengajuan surat tugas tidak dapat disetujui."
      );
    }

    let surat =
      await createFromAssignment(
        assignment.id,
        transaction
      );

    await assignment.update(
      {
        status:
          "approved",

        reviewed_by:
          adminId,

        reviewed_at:
          assignment.reviewed_at ||
          getCurrentDate(),

        approved_at:
          getCurrentDate(),
      },
      {
        transaction,
      }
    );

    surat =
      await applySignatureSnapshot(
        surat,
        transaction
      );

    surat =
      await applyOrganizationSnapshot(
        surat,
        transaction
      );

    surat =
      await applyTemplateSnapshot(
        surat,
        transaction
      );

    const verification =
      await verificationService.generateVerification(
        surat.id,
        transaction
      );

    await transaction.commit();

    let pdf = null;
    let pdfError = null;
    let email = null;
    let emailError = null;

    try {
      pdf =
        await pdfService.generatePdf(
          surat.id
        );
    } catch (error) {
      console.error(
        "Gagal generate PDF Surat Tugas:",
        error
      );

      pdfError =
        error.message ||
        "Gagal generate PDF.";
    }

    if (pdf && !pdfError) {
      try {
        email =
          await emailService.sendSurat(
            surat.id
          );
      } catch (error) {
        console.error(
          "Gagal mengirim email Surat Tugas:",
          error
        );

        emailError =
          error.message ||
          "Gagal mengirim email.";
      }
    }

    const latestSurat =
      await Surat.findByPk(
        surat.id,
        {
          include: [
            {
              model:
                SuratInvitation,

              as:
                "invitation",
            },

            {
              model:
                SuratAssignment,

              as:
                "assignment",
            },

            {
              model:
                Verification,

              as:
                "verification",
            },
          ],
        }
      );

    const latestAssignment =
      await SuratAssignment.findByPk(
        assignmentId
      );

    return {
      assignment:
        latestAssignment,

      surat:
        latestSurat,

      verification,

      pdf,

      pdfError,

      email,

      emailError,
    };
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};

const getById = async (
  id
) => {
  const surat =
    await Surat.findByPk(
      id,
      {
        include: [
          {
            model:
              SuratInvitation,

            as:
              "invitation",
          },

          {
            model:
              SuratAssignment,

            as:
              "assignment",
          },

          {
            model:
              Verification,

            as:
              "verification",
          },
        ],
      }
    );

  if (!surat) {
    throw new Error(
      "Surat tidak ditemukan."
    );
  }

  return surat;
};

const getAll = async (
  query = {}
) => {
  const where = {};

  if (query.type) {
    where.type =
      query.type;
  }

  if (query.status) {
    where.status =
      query.status;
  }

  if (query.email_status) {
    where.email_status =
      query.email_status;
  }

  return Surat.findAll({
    where,

    include: [
      {
        model:
          SuratInvitation,

        as:
          "invitation",
      },

      {
        model:
          SuratAssignment,

        as:
          "assignment",
      },

      {
        model:
          Verification,

        as:
          "verification",
      },
    ],

    order: [
      ["created_at", "DESC"],
    ],
  });
};

module.exports = {
  generateLetterNumber,
  createFromInvitation,
  createFromAssignment,
  applySignatureSnapshot,
  applyOrganizationSnapshot,
  applyTemplateSnapshot,
  generateDocument,
  approveInvitation,
  approveAssignment,
  getById,
  getAll,
};