const {
  Op,
} = require("sequelize");

const suratService =
  require("./suratService");

const {
  SuratInvitation,
  User,
} = require("../models");

const ALLOWED_UPDATE_FIELDS = [
  "participant_name",
  "participant_email",
  "participant_phone",
  "organization",
  "recipient_name",
  "recipient_position",
  "recipient_organization",
  "activity_name",
  "activity_description",
  "activity_date",
  "activity_end_date",
  "activity_time",
  "location",
  "activity_address",
  "invitation_subject",
  "letter_number",
  "letter_date",
  "notes",
  "admin_notes",
];

const ROMAN_MONTHS = [
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

const generateInvitationLetterNumber =
  async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const lastInvitation =
      await SuratInvitation.findOne({
        where: {
          letter_number: {
            [Op.ne]: null,
          },
        },
        order: [
          ["id", "DESC"],
        ],
      });

    let sequence = 1;

    if (
      lastInvitation?.letter_number
    ) {
      const match =
        lastInvitation.letter_number.match(
          /^D\.10\/(\d{4})\/RJI\/[IVXLCDM]+\/\d{4}$/
        );

      if (match) {
        sequence =
          Number(match[1]) + 1;
      }
    }

    const number =
      String(sequence).padStart(
        4,
        "0"
      );

    return `D.10/${number}/RJI/${ROMAN_MONTHS[month - 1]}/${year}`;
  };

const create = async (
  data = {}
) => {
  const requiredFields = [
    "participant_name",
    "participant_email",
    "recipient_name",
    "recipient_position",
    "recipient_organization",
    "activity_name",
    "activity_description",
    "activity_date",
    "activity_time",
    "location",
    "activity_address",
  ];

  for (const field of requiredFields) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      !String(data[field]).trim()
    ) {
      throw new Error(
        `${field} wajib diisi.`
      );
    }
  }

  const letterNumber =
    await generateInvitationLetterNumber();

  const invitation =
    await SuratInvitation.create({
      participant_name:
        data.participant_name,

      participant_email:
        data.participant_email,

      participant_phone:
        data.participant_phone ||
        null,

      organization:
        data.organization ||
        null,

      recipient_name:
        data.recipient_name,

      recipient_position:
        data.recipient_position,

      recipient_organization:
        data.recipient_organization,

      activity_name:
        data.activity_name,

      activity_description:
        data.activity_description,

      activity_date:
        data.activity_date,

      activity_end_date:
        data.activity_end_date ||
        null,

      activity_time:
        data.activity_time,

      location:
        data.location,

      activity_address:
        data.activity_address,

      invitation_subject:
        data.invitation_subject ||
        data.activity_name,

      letter_number:
        letterNumber,

      letter_date:
        new Date(),

      notes:
        data.notes ||
        null,

      status:
        "pending",
    });

  return invitation;
};

const getAll = async (
  query = {}
) => {
  const where = {};

  if (query.status) {
    where.status =
      query.status;
  }

  return SuratInvitation.findAll({
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
    ],

    order: [
      ["created_at", "DESC"],
    ],
  });
};

const getById = async (
  id
) => {
  const invitation =
    await SuratInvitation.findByPk(
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
        ],
      }
    );

  if (!invitation) {
    throw new Error(
      "Pengajuan surat undangan tidak ditemukan."
    );
  }

  return invitation;
};

const update = async (
  id,
  data = {}
) => {
  const invitation =
    await SuratInvitation.findByPk(
      id
    );

  if (!invitation) {
    throw new Error(
      "Pengajuan surat undangan tidak ditemukan."
    );
  }

  if (
    [
      "approved",
      "rejected",
    ].includes(
      invitation.status
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
      updateData[field] =
        data[field];
    }
  }

  if (
    updateData.activity_name !==
      undefined &&
    !updateData.invitation_subject
  ) {
    updateData.invitation_subject =
      updateData.activity_name;
  }

  await invitation.update(
    updateData
  );

  return getById(id);
};

const review = async (
  id,
  adminId,
  data = {}
) => {
  const invitation =
    await SuratInvitation.findByPk(
      id
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
      "Pengajuan ini tidak dapat direview."
    );
  }

  const updateData = {
    status: "review",
    reviewed_by: adminId,
    reviewed_at:
      new Date(),
  };

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(
        data,
        field
      )
    ) {
      updateData[field] =
        data[field];
    }
  }

  await invitation.update(
    updateData
  );

  return getById(id);
};

const approve = async (
  id,
  adminId
) => {
  return suratService.approveInvitation(
    id,
    adminId
  );
};

const reject = async (
  id,
  adminId,
  data = {}
) => {
  const invitation =
    await SuratInvitation.findByPk(
      id
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

  await invitation.update({
    status:
      "rejected",

    reviewed_by:
      adminId,

    reviewed_at:
      new Date(),

    rejected_at:
      new Date(),

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
  generateInvitationLetterNumber,
};