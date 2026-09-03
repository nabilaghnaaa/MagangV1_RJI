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

const verificationService =
  require("./verificationService");

const pdfService =
  require("./pdfService");

const emailService =
  require("./emailService");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Generate Nomor Surat
|--------------------------------------------------------------------------
|
| Format Surat Undangan / Surat Tugas:
|
| D.10/0001/RJI/IX/2026
|
| Nomor ini hanya menjadi nomor default.
| Admin masih dapat mengubah nomor sebelum approval.
|
|--------------------------------------------------------------------------
*/

const generateLetterNumber = async (
  type,
  transaction
) => {
  const now =
    getCurrentDate();

  const year =
    now.getFullYear();

  const month =
    getRomanMonth(
      now.getMonth()
    );

  const lastLetter =
    await Surat.findOne({
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

  if (
    lastLetter?.letter_number
  ) {
    const match =
      lastLetter.letter_number.match(
        /^D\.10\/(\d+)\/RJI\/[IVX]+\/\d{4}$/
      );

    if (match) {
      sequence =
        Number(
          match[1]
        ) + 1;
    }
  }

  const paddedSequence =
    String(
      sequence
    ).padStart(
      4,
      "0"
    );

  return `D.10/${paddedSequence}/RJI/${month}/${year}`;
};

/*
|--------------------------------------------------------------------------
| Active Signature
|--------------------------------------------------------------------------
*/

const getActiveSignatureSetting =
  async (
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

/*
|--------------------------------------------------------------------------
| Active Organization
|--------------------------------------------------------------------------
*/

const getActiveOrganizationSetting =
  async (
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

/*
|--------------------------------------------------------------------------
| Active Template
|--------------------------------------------------------------------------
*/

const getActiveTemplate =
  async (
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

      lock: true,
    });
  };

/*
|--------------------------------------------------------------------------
| Create Surat from Invitation
|--------------------------------------------------------------------------
*/

const createFromInvitation =
  async (
    invitationId,
    transaction
  ) => {
    const invitation =
      await SuratInvitation.findByPk(
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

    /*
    |--------------------------------------------------------------------------
    | Jangan membuat surat kedua untuk satu pengajuan
    |--------------------------------------------------------------------------
    */

    const existing =
      await Surat.findOne({
        where: {
          invitation_id:
            invitationId,
        },

        transaction,
      });

    if (existing) {
      return existing;
    }

    /*
    |--------------------------------------------------------------------------
    | Nomor surat:
    | gunakan nomor yang sudah diedit Admin jika ada.
    |--------------------------------------------------------------------------
    */

    const letterNumber =
      invitation.letter_number ||
      (await generateLetterNumber(
        "invitation",
        transaction
      ));

    /*
    |--------------------------------------------------------------------------
    | Tanggal surat:
    | gunakan tanggal yang sudah diedit Admin.
    | Jika kosong, pakai tanggal approval.
    |--------------------------------------------------------------------------
    */

    const letterDate =
      invitation.letter_date ||
      getCurrentDate();

    /*
    |--------------------------------------------------------------------------
    | Subject:
    | invitation_subject -> activity_name
    |--------------------------------------------------------------------------
    */

    const subject =
      invitation.invitation_subject ||
      invitation.activity_name;

    /*
    |--------------------------------------------------------------------------
    | Penerima surat berbeda dengan peserta.
    |
    | recipient_name:
    | Kepada Yth.
    |
    | participant_name:
    | atas nama ...
    |--------------------------------------------------------------------------
    */

    const recipientName =
      invitation.recipient_name ||
      invitation.participant_name;

    /*
    |--------------------------------------------------------------------------
    | Email tetap ke peserta
    |--------------------------------------------------------------------------
    */

    const recipientEmail =
      invitation.participant_email;

    return Surat.create(
      {
        type: "invitation",

        invitation_id:
          invitation.id,

        assignment_id:
          null,

        letter_number:
          letterNumber,

        letter_date:
          letterDate,

        subject,

        recipient_name:
          recipientName,

        recipient_email:
          recipientEmail,

        status: "issued",

        email_status:
          "pending",
      },

      {
        transaction,
      }
    );
  };

/*
|--------------------------------------------------------------------------
| Create Surat from Assignment
|--------------------------------------------------------------------------
*/

const createFromAssignment =
  async (
    assignmentId,
    transaction
  ) => {
    const assignment =
      await SuratAssignment.findByPk(
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

    const existing =
      await Surat.findOne({
        where: {
          assignment_id:
            assignmentId,
        },

        transaction,
      });

    if (existing) {
      return existing;
    }

    const letterNumber =
      assignment.letter_number ||
      (await generateLetterNumber(
        "assignment",
        transaction
      ));

    const letterDate =
      assignment.letter_date ||
      getCurrentDate();

    const subject =
      assignment.assignment_subject ||
      assignment.activity_name;

    return Surat.create(
      {
        type: "assignment",

        invitation_id:
          null,

        assignment_id:
          assignment.id,

        letter_number:
          letterNumber,

        letter_date:
          letterDate,

        subject,

        recipient_name:
          assignment.member_name,

        recipient_email:
          assignment.member_email,

        status: "issued",

        email_status:
          "pending",
      },

      {
        transaction,
      }
    );
  };

/*
|--------------------------------------------------------------------------
| Signature Snapshot
|--------------------------------------------------------------------------
*/

const applySignatureSnapshot =
  async (
    surat,
    transaction
  ) => {
    const signatureSetting =
      await getActiveSignatureSetting(
        transaction
      );

    if (!signatureSetting) {
      throw new Error(
        "Konfigurasi tanda tangan aktif belum tersedia."
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Mode scan wajib mempunyai file tanda tangan
    |--------------------------------------------------------------------------
    */

    if (
      signatureSetting.mode ===
        "scan" &&
      !signatureSetting.signature_path
    ) {
      throw new Error(
        "File tanda tangan untuk mode scan belum tersedia."
      );
    }

    await surat.update(
      {
        signature_mode:
          signatureSetting.mode,

        signature_name:
          signatureSetting.signer_name,

        signature_position:
          signatureSetting.signer_position,

        signature_path:
          signatureSetting.signature_path ||
          null,

        signature_type:
          signatureSetting.mode ===
          "barcode"
            ? "barcode"
            : "manual",
      },

      {
        transaction,
      }
    );

    return surat;
  };

/*
|--------------------------------------------------------------------------
| Organization Snapshot
|--------------------------------------------------------------------------
*/

const applyOrganizationSnapshot =
  async (
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

/*
|--------------------------------------------------------------------------
| Template Snapshot
|--------------------------------------------------------------------------
*/

const applyTemplateSnapshot =
  async (
    surat,
    transaction
  ) => {
    const template =
      await getActiveTemplate(
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
          template.footer ||
          null,
      },

      {
        transaction,
      }
    );

    return surat;
  };

/*
|--------------------------------------------------------------------------
| Generate Document
|--------------------------------------------------------------------------
*/

const generateDocument =
  async (
    suratId
  ) => {
    const pdf =
      await pdfService.generatePdf(
        suratId
      );

    const email =
      await emailService.sendSurat(
        suratId
      );

    return {
      pdf,
      email,
    };
  };

/*
|--------------------------------------------------------------------------
| Approve Invitation
|--------------------------------------------------------------------------
*/

const approveInvitation =
  async (
    invitationId,
    adminId
  ) => {
    const transaction =
      await sequelize.transaction();

    try {
      /*
      |--------------------------------------------------------------------------
      | Lock pengajuan
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | Hanya pending / review yang boleh approve
      |--------------------------------------------------------------------------
      */

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

      /*
      |--------------------------------------------------------------------------
      | Create Surat
      |--------------------------------------------------------------------------
      */

      let surat =
        await createFromInvitation(
          invitation.id,
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Mark Approved
      |--------------------------------------------------------------------------
      */

      await invitation.update(
        {
          status:
            "approved",

          reviewed_by:
            adminId,

          reviewed_at:
            invitation.reviewed_at ||
            new Date(),

          approved_at:
            new Date(),
        },

        {
          transaction,
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Snapshot Signature
      |--------------------------------------------------------------------------
      */

      surat =
        await applySignatureSnapshot(
          surat,
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Snapshot Organization
      |--------------------------------------------------------------------------
      */

      surat =
        await applyOrganizationSnapshot(
          surat,
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Snapshot Template
      |--------------------------------------------------------------------------
      */

      surat =
        await applyTemplateSnapshot(
          surat,
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Generate Verification
      |--------------------------------------------------------------------------
      */

      const verification =
        await verificationService.generateVerification(
          surat.id,
          transaction
        );

      /*
      |--------------------------------------------------------------------------
      | Commit DB
      |--------------------------------------------------------------------------
      */

      await transaction.commit();

      /*
      |--------------------------------------------------------------------------
      | Generate PDF
      |--------------------------------------------------------------------------
      |
      | PDF dilakukan setelah commit supaya proses database
      | tidak tertahan oleh Puppeteer.
      |--------------------------------------------------------------------------
      */

      let pdf =
        null;

      let pdfError =
        null;

      let email =
        null;

      let emailError =
        null;

      try {
        pdf =
          await pdfService.generatePdf(
            surat.id
          );
      } catch (
        error
      ) {
        console.error(
          "Gagal generate PDF Surat Undangan:",
          error
        );

        pdfError =
          error.message ||
          "Gagal generate PDF.";
      }

      /*
      |--------------------------------------------------------------------------
      | Kirim Email setelah PDF berhasil
      |--------------------------------------------------------------------------
      */

      if (
        pdf &&
        !pdfError
      ) {
        try {
          email =
            await emailService.sendSurat(
              surat.id
            );
        } catch (
          error
        ) {
          console.error(
            "Gagal mengirim email Surat Undangan:",
            error
          );

          emailError =
            error.message ||
            "Gagal mengirim email.";
        }
      }

      /*
      |--------------------------------------------------------------------------
      | Ambil data terbaru
      |--------------------------------------------------------------------------
      */

      const latestSurat =
        await Surat.findByPk(
          surat.id
        );

      return {
        invitation,
        surat:
          latestSurat,
        verification,
        pdf,
        pdfError,
        email,
        emailError,
      };
    } catch (
      error
    ) {
      /*
      |--------------------------------------------------------------------------
      | Rollback hanya jika transaction masih aktif
      |--------------------------------------------------------------------------
      */

      try {
        if (
          !transaction.finished
        ) {
          await transaction.rollback();
        }
      } catch (
        rollbackError
      ) {
        console.error(
          "Gagal rollback transaction:",
          rollbackError
        );
      }

      throw error;
    }
  };

/*
|--------------------------------------------------------------------------
| Approve Assignment
|--------------------------------------------------------------------------
*/

const approveAssignment =
  async (
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
            new Date(),

          approved_at:
            new Date(),
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

      let pdf =
        null;

      let pdfError =
        null;

      let email =
        null;

      let emailError =
        null;

      try {
        pdf =
          await pdfService.generatePdf(
            surat.id
          );
      } catch (
        error
      ) {
        console.error(
          "Gagal generate PDF Surat Tugas:",
          error
        );

        pdfError =
          error.message ||
          "Gagal generate PDF.";
      }

      if (
        pdf &&
        !pdfError
      ) {
        try {
          email =
            await emailService.sendSurat(
              surat.id
            );
        } catch (
          error
        ) {
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
        surat:
          latestSurat,
        verification,
        pdf,
        pdfError,
        email,
        emailError,
      };
    } catch (
      error
    ) {
      try {
        if (
          !transaction.finished
        ) {
          await transaction.rollback();
        }
      } catch (
        rollbackError
      ) {
        console.error(
          "Gagal rollback transaction:",
          rollbackError
        );
      }

      throw error;
    }
  };

/*
|--------------------------------------------------------------------------
| Get Surat by ID
|--------------------------------------------------------------------------
*/

const getById =
  async (
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

              as: "invitation",
            },

            {
              model:
                SuratAssignment,

              as: "assignment",
            },

            {
              model:
                Verification,

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

/*
|--------------------------------------------------------------------------
| Get All Surat
|--------------------------------------------------------------------------
*/

const getAll =
  async (
    query = {}
  ) => {
    const where = {};

    if (
      query.type
    ) {
      where.type =
        query.type;
    }

    if (
      query.status
    ) {
      where.status =
        query.status;
    }

    if (
      query.email_status
    ) {
      where.email_status =
        query.email_status;
    }

    return Surat.findAll({
      where,

      include: [
        {
          model:
            SuratInvitation,

          as: "invitation",
        },

        {
          model:
            SuratAssignment,

          as: "assignment",
        },

        {
          model:
            Verification,

          as: "verification",
        },
      ],

      order: [
        ["created_at", "DESC"],
      ],
    });
  };

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

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