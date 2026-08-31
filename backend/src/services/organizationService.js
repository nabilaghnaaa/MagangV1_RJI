const {
  OrganizationSetting,
  User,
} = require("../models");

const getActive = async () => {
  return OrganizationSetting.findOne({
    where: {
      is_active: true,
    },
    include: [
      {
        model: User,
        as: "updater",
        attributes: [
          "id",
          "name",
          "email",
        ],
      },
    ],
    order: [
      ["id", "DESC"],
    ],
  });
};

const createDefault = async () => {
  const existing = await getActive();

  if (existing) {
    return existing;
  }

  return OrganizationSetting.create({
    organization_name: "Relawan Jurnal Indonesia",
    organization_short_name: "RJI",
    address: null,
    email: null,
    phone: null,
    website: null,
    logo_path: null,
    is_active: true,
    updated_by: null,
  });
};

const update = async (data = {}, userId) => {
  let setting = await getActive();

  if (!setting) {
    setting = await createDefault();
  }

  const updateData = {};

  if (data.organization_name !== undefined) {
    if (!String(data.organization_name).trim()) {
      throw new Error(
        "Nama organisasi wajib diisi."
      );
    }

    updateData.organization_name =
      String(data.organization_name).trim();
  }

  if (data.organization_short_name !== undefined) {
    updateData.organization_short_name =
      data.organization_short_name
        ? String(data.organization_short_name).trim()
        : null;
  }

  if (data.address !== undefined) {
    updateData.address =
      data.address || null;
  }

  if (data.email !== undefined) {
    updateData.email =
      data.email || null;
  }

  if (data.phone !== undefined) {
    updateData.phone =
      data.phone || null;
  }

  if (data.website !== undefined) {
    updateData.website =
      data.website || null;
  }

  if (data.logo_path !== undefined) {
    updateData.logo_path =
      data.logo_path || null;
  }

  updateData.updated_by = userId;

  await setting.update(updateData);

  return getActive();
};

module.exports = {
  getActive,
  createDefault,
  update,
};