const fs = require("fs/promises");

const {
  sequelize,
  SuratAssignment,
  Attachment,
  User,
} = require("../models");

const suratService = require("./suratService");

const ALLOWED_UPDATE_FIELDS = [
  "member_name",
  "member_email",
  "member_phone",
  "member_organization",
  "member_role",
  "activity_name",
  "activity_description",
  "activity_date",
  "activity_end_date",
  "activity_time",
  "location",
  "assignment_subject",
  "request_letter_number",
  "request_letter_date",
  "notes",
  "admin_notes",
];

const create = async (
  data = {},
  uploadedFile = null
) => {
  const requiredFields = [
    "member_name",
    "member_email",
    "member_role",
    "activity_name",
    "activity_date",
    "location",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} wajib diisi.`);
    }
  }

  const transaction =
    await sequelize.transaction();

  try {
    const assignment =
      await SuratAssignment.create(
        {
          member_name:
            data.member_name,

          member_email:
            data.member_email,

          member_phone:
            data.member_phone || null,

          member_organization:
            data.member_organization || null,

          member_role:
            data.member_role,

          activity_name:
            data.activity_name,

          activity_description:
            data.activity_description ||
            null,

          activity_date:
            data.activity_date,

          activity_end_date:
            data.activity_end_date ||
            null,

          activity_time:
            data.activity_time || null,

          location:
            data.location,

          assignment_subject:
            data.assignment_subject ||
            null,

          request_letter_number:
            data.request_letter_number ||
            null,

          request_letter_date:
            data.request_letter_date ||
            null,

          notes:
            data.notes || null,

          status: "pending",
        },
        {
          transaction,
        }
      );

    if (uploadedFile) {
      await Attachment.create(
        {
          assignment_id:
            assignment.id,

          original_name:
            uploadedFile.originalname,

          stored_name:
            uploadedFile.filename,

          file_path:
            `storage/uploads/assignments/${uploadedFile.filename}`,

          mime_type:
            uploadedFile.mimetype,

          file_size:
            uploadedFile.size,

          attachment_type:
            "request_letter",
        },
        {
          transaction,
        }
      );
    }

    await transaction.commit();

    return getById(
      assignment.id
    );
  } catch (error) {
    await transaction.rollback();

    if (uploadedFile?.path) {
      try {
        await fs.unlink(
          uploadedFile.path
        );
      } catch {
        // File sudah tidak ada.
      }
    }

    throw error;
  }
};

const getAll = async (query = {}) => {
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  return SuratAssignment.findAll({
    where,

    include: [
      {
        model: User,
        as: "reviewer",
        attributes: [
          "id",
          "name",
          "email",
        ],
      },

      {
        model: Attachment,
        as: "attachments",
        attributes: [
          "id",
          "original_name",
          "stored_name",
          "file_path",
          "mime_type",
          "file_size",
          "attachment_type",
          "created_at",
        ],
      },
    ],

    order: [
      ["created_at", "DESC"],
    ],
  });
};

const getById = async (id) => {
  const assignment =
    await SuratAssignment.findByPk(
      id,
      {
        include: [
          {
            model: User,
            as: "reviewer",
            attributes: [
              "id",
              "name",
              "email",
            ],
          },

          {
            model: Attachment,
            as: "attachments",
          },
        ],
      }
    );

  if (!assignment) {
    throw new Error(
      "Pengajuan surat tugas tidak ditemukan."
    );
  }

  return assignment;
};

const update = async (
  id,
  data = {}
) => {
  const assignment =
    await SuratAssignment.findByPk(id);

  if (!assignment) {
    throw new Error(
      "Pengajuan surat tugas tidak ditemukan."
    );
  }

  if (
    ["approved", "rejected"].includes(
      assignment.status
    )
  ) {
    throw new Error(
      "Pengajuan yang sudah diproses tidak dapat diedit."
    );
  }

  const updateData = {};

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(
        data,
        field
      )
    ) {
      updateData[field] = data[field];
    }
  }

  await assignment.update(
    updateData
  );

  return getById(id);
};

const review = async (
  id,
  adminId,
  data = {}
) => {
  const assignment =
    await SuratAssignment.findByPk(id);

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
      "Pengajuan ini tidak dapat direview."
    );
  }

  const updateData = {
    status: "review",
    reviewed_by: adminId,
    reviewed_at: new Date(),
  };

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(
        data,
        field
      )
    ) {
      updateData[field] = data[field];
    }
  }

  await assignment.update(
    updateData
  );

  return getById(id);
};

/*
|--------------------------------------------------------------------------
| APPROVE
|--------------------------------------------------------------------------
*/

const approve = async (
  id,
  adminId
) => {
  return suratService.approveAssignment(
    id,
    adminId
  );
};

const reject = async (
  id,
  adminId,
  data = {}
) => {
  const assignment =
    await SuratAssignment.findByPk(id);

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
      "Pengajuan ini tidak dapat ditolak."
    );
  }

  if (
    !data.rejection_reason ||
    !data.rejection_reason.trim()
  ) {
    throw new Error(
      "Alasan penolakan wajib diisi."
    );
  }

  await assignment.update({
    status: "rejected",

    reviewed_by: adminId,

    reviewed_at: new Date(),

    rejected_at: new Date(),

    rejection_reason:
      data.rejection_reason.trim(),
  });

  return getById(id);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  review,
  approve,
  reject,
};