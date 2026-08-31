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

const generateLetterNumber = async (type, transaction) => {
  const year = new Date().getFullYear();
  const prefix = type === "invitation" ? "UND" : "TGS";

  const lastLetter = await Surat.findOne({
    where: {
      type,
    },
    order: [
      ["id", "DESC"],
    ],
    transaction,
    lock: true,
  });

  let sequence = 1;

  if (lastLetter?.letter_number) {
    const match = lastLetter.letter_number.match(
      /RJI\/(?:UND|TGS)\/(\d+)\/\d{4}$/
    );

    if (match) {
      sequence = Number(match[1]) + 1;
    }
  }

  const paddedSequence = String(sequence).padStart(3, "0");

  return `RJI/${prefix}/${paddedSequence}/${year}`;
};

const getActiveSignatureSetting = async (transaction) => {
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

const getActiveOrganizationSetting = async (transaction) => {
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

const getActiveTemplate = async (type, transaction) => {
  return SuratTemplate.findOne({
    where: {
      type,
      is_active: true,
    },
    order: [
      ["created_at", "DESC"],
    ],
    transaction,
    lock: true,
  });
};

const createFromInvitation = async (invitationId, transaction) => {
  const invitation = await SuratInvitation.findByPk(
    invitationId,
    {
      transaction,
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
  });

  if (existing) {
    return existing;
  }

  const letterNumber = await generateLetterNumber(
    "invitation",
    transaction
  );

  return Surat.create(
    {
      type: "invitation",
      invitation_id: invitation.id,
      assignment_id: null,
      letter_number: letterNumber,
      letter_date: new Date(),
      subject:
        invitation.invitation_subject ||
        invitation.activity_name,
      recipient_name: invitation.participant_name,
      recipient_email: invitation.participant_email,
      status: "issued",
      email_status: "pending",
    },
    {
      transaction,
    }
  );
};

const createFromAssignment = async (assignmentId, transaction) => {
  const assignment = await SuratAssignment.findByPk(
    assignmentId,
    {
      transaction,
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
  });

  if (existing) {
    return existing;
  }

  const letterNumber = await generateLetterNumber(
    "assignment",
    transaction
  );

  return Surat.create(
    {
      type: "assignment",
      invitation_id: null,
      assignment_id: assignment.id,
      letter_number: letterNumber,
      letter_date: new Date(),
      subject:
        assignment.assignment_subject ||
        assignment.activity_name,
      recipient_name: assignment.member_name,
      recipient_email: assignment.member_email,
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
  const signatureSetting =
    await getActiveSignatureSetting(transaction);

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

  await surat.update(
    {
      signature_mode: signatureSetting.mode,
      signature_name: signatureSetting.signer_name,
      signature_position:
        signatureSetting.signer_position,
      signature_path:
        signatureSetting.signature_path || null,
      signature_type:
        signatureSetting.mode === "barcode"
          ? "barcode"
          : "manual",
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
    await getActiveOrganizationSetting(transaction);

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
      template_id: template.id,
      template_name: template.name,
      template_content: template.content,
      template_footer: template.footer || null,
    },
    {
      transaction,
    }
  );

  return surat;
};

const generateDocument = async (suratId) => {
  const pdf = await pdfService.generatePdf(suratId);
  const email = await emailService.sendSurat(suratId);

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
      !["pending", "review"].includes(
        invitation.status
      )
    ) {
      throw new Error(
        "Pengajuan surat undangan tidak dapat disetujui."
      );
    }

    let surat = await createFromInvitation(
      invitation.id,
      transaction
    );

    await invitation.update(
      {
        status: "approved",
        reviewed_by: adminId,
        reviewed_at:
          invitation.reviewed_at ||
          new Date(),
        approved_at: new Date(),
      },
      {
        transaction,
      }
    );

    surat = await applySignatureSnapshot(
      surat,
      transaction
    );

    surat = await applyOrganizationSnapshot(
      surat,
      transaction
    );

    surat = await applyTemplateSnapshot(
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
      pdf = await pdfService.generatePdf(
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
        surat.id
      );

    return {
      invitation,
      surat: latestSurat,
      verification,
      pdf,
      pdfError,
      email,
      emailError,
    };
  } catch (error) {
    await transaction.rollback();
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
      !["pending", "review"].includes(
        assignment.status
      )
    ) {
      throw new Error(
        "Pengajuan surat tugas tidak dapat disetujui."
      );
    }

    let surat = await createFromAssignment(
      assignment.id,
      transaction
    );

    await assignment.update(
      {
        status: "approved",
        reviewed_by: adminId,
        reviewed_at:
          assignment.reviewed_at ||
          new Date(),
        approved_at: new Date(),
      },
      {
        transaction,
      }
    );

    surat = await applySignatureSnapshot(
      surat,
      transaction
    );

    surat = await applyOrganizationSnapshot(
      surat,
      transaction
    );

    surat = await applyTemplateSnapshot(
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
      pdf = await pdfService.generatePdf(
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
        surat.id
      );

    return {
      assignment,
      surat: latestSurat,
      verification,
      pdf,
      pdfError,
      email,
      emailError,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (id) => {
  const surat =
    await Surat.findByPk(
      id,
      {
        include: [
          {
            model: SuratInvitation,
            as: "invitation",
          },
          {
            model: SuratAssignment,
            as: "assignment",
          },
          {
            model: Verification,
            as: "verification",
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
    where.type = query.type;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.email_status) {
    where.email_status =
      query.email_status;
  }

  return Surat.findAll({
    where,
    include: [
      {
        model: SuratInvitation,
        as: "invitation",
      },
      {
        model: SuratAssignment,
        as: "assignment",
      },
      {
        model: Verification,
        as: "verification",
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
  approveInvitation,
  approveAssignment,
  getById,
  getAll,
  generateDocument,
};