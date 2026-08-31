const {
  SuratTemplate,
  User,
} = require("../models");

const ALLOWED_FIELDS = [
  "type",
  "name",
  "description",
  "content",
  "footer",
  "signature_type",
  "is_active",
];

const VALID_TYPES = [
  "invitation",
  "assignment",
];

const VALID_SIGNATURE_TYPES = [
  "manual",
  "barcode",
  "digital",
];

const validateTemplateType = (type) => {
  if (!VALID_TYPES.includes(type)) {
    throw new Error("Jenis template tidak valid.");
  }
};

const validateSignatureType = (signatureType) => {
  if (
    signatureType &&
    !VALID_SIGNATURE_TYPES.includes(signatureType)
  ) {
    throw new Error("Jenis tanda tangan tidak valid.");
  }
};

const validateTemplateData = (data = {}) => {
  if (!data.type) {
    throw new Error("Jenis template wajib diisi.");
  }

  if (!data.name || !String(data.name).trim()) {
    throw new Error("Nama template wajib diisi.");
  }

  if (!data.content || !String(data.content).trim()) {
    throw new Error("Isi template wajib diisi.");
  }

  validateTemplateType(data.type);
  validateSignatureType(data.signature_type);
};

const create = async (data = {}, userId) => {
  validateTemplateData(data);

  const existingActiveTemplate = await SuratTemplate.findOne({
    where: {
      type: data.type,
      is_active: true,
    },
  });

  const template = await SuratTemplate.create({
    type: data.type,
    name: String(data.name).trim(),
    description: data.description || null,
    content: data.content,
    footer: data.footer || null,
    signature_type: data.signature_type || "manual",
    is_active:
      data.is_active === undefined
        ? !existingActiveTemplate
        : Boolean(data.is_active),
    created_by: userId || null,
  });

  return getById(template.id);
};

const getAll = async (query = {}) => {
  const where = {};

  if (query.type) {
    validateTemplateType(query.type);
    where.type = query.type;
  }

  if (query.is_active !== undefined) {
    where.is_active =
      query.is_active === true ||
      query.is_active === "true";
  }

  return SuratTemplate.findAll({
    where,
    include: [
      {
        model: User,
        as: "creator",
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

const getById = async (id) => {
  const template = await SuratTemplate.findByPk(
    id,
    {
      include: [
        {
          model: User,
          as: "creator",
          attributes: [
            "id",
            "name",
            "email",
          ],
        },
      ],
    }
  );

  if (!template) {
    throw new Error("Template surat tidak ditemukan.");
  }

  return template;
};

const update = async (id, data = {}) => {
  const template = await SuratTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template surat tidak ditemukan.");
  }

  if (data.type !== undefined) {
    validateTemplateType(data.type);
  }

  if (data.signature_type !== undefined) {
    validateSignatureType(data.signature_type);
  }

  if (
    data.name !== undefined &&
    !String(data.name).trim()
  ) {
    throw new Error("Nama template wajib diisi.");
  }

  if (
    data.content !== undefined &&
    !String(data.content).trim()
  ) {
    throw new Error("Isi template wajib diisi.");
  }

  if (
    data.is_active === false &&
    template.is_active
  ) {
    const activeCount = await SuratTemplate.count({
      where: {
        type: template.type,
        is_active: true,
      },
    });

    if (activeCount <= 1) {
      throw new Error(
        `Template aktif untuk ${template.type} tidak dapat dinonaktifkan karena harus tersedia minimal satu template aktif.`
      );
    }
  }

  const updateData = {};

  for (const field of ALLOWED_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(
        data,
        field
      )
    ) {
      updateData[field] =
        field === "name"
          ? String(data[field]).trim()
          : data[field];
    }
  }

  await template.update(updateData);

  return getById(id);
};

const remove = async (id) => {
  const template = await SuratTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template surat tidak ditemukan.");
  }

  if (template.is_active) {
    const activeCount = await SuratTemplate.count({
      where: {
        type: template.type,
        is_active: true,
      },
    });

    if (activeCount <= 1) {
      throw new Error(
        `Template aktif untuk ${template.type} tidak dapat dihapus karena harus tersedia minimal satu template aktif.`
      );
    }
  }

  await template.destroy();

  return true;
};

const activate = async (id) => {
  const template = await SuratTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template surat tidak ditemukan.");
  }

  const transaction =
    await SuratTemplate.sequelize.transaction();

  try {
    await SuratTemplate.update(
      {
        is_active: false,
      },
      {
        where: {
          type: template.type,
          id: {
            [require("sequelize").Op.ne]: template.id,
          },
        },
        transaction,
      }
    );

    await template.update(
      {
        is_active: true,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return getById(id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deactivate = async (id) => {
  const template = await SuratTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template surat tidak ditemukan.");
  }

  if (!template.is_active) {
    return getById(id);
  }

  const activeCount = await SuratTemplate.count({
    where: {
      type: template.type,
      is_active: true,
    },
  });

  if (activeCount <= 1) {
    throw new Error(
      `Template aktif untuk ${template.type} tidak dapat dinonaktifkan karena harus tersedia minimal satu template aktif.`
    );
  }

  await template.update({
    is_active: false,
  });

  return getById(id);
};

const getActiveByType = async (type) => {
  validateTemplateType(type);

  const template = await SuratTemplate.findOne({
    where: {
      type,
      is_active: true,
    },
    order: [
      ["created_at", "DESC"],
    ],
  });

  if (!template) {
    throw new Error(
      `Template aktif untuk ${type} belum tersedia.`
    );
  }

  return template;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  activate,
  deactivate,
  getActiveByType,
};