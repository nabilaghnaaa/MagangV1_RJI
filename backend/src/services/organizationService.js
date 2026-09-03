const path = require("path");
const fs = require("fs/promises");

const {
  OrganizationSetting,
  User,
} = require("../models");

const LETTERHEAD_DIRECTORY =
  path.resolve(
    __dirname,
    "../../storage/letterheads"
  );

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
  const existing =
    await getActive();

  if (existing) {
    return existing;
  }

  return OrganizationSetting.create({
    organization_name:
      "Relawan Jurnal Indonesia",

    organization_short_name:
      "RJI",

    address: null,
    email: null,
    phone: null,
    website: null,
    logo_path: null,

    letterhead_top_path:
      null,

    letterhead_bottom_path:
      null,

    is_active: true,
    updated_by: null,
  });
};

const update = async (
  data = {},
  userId
) => {
  let setting =
    await getActive();

  if (!setting) {
    setting =
      await createDefault();
  }

  const updateData = {};

  if (
    data.organization_name !==
    undefined
  ) {
    if (
      !String(
        data.organization_name
      ).trim()
    ) {
      throw new Error(
        "Nama organisasi wajib diisi."
      );
    }

    updateData.organization_name =
      String(
        data.organization_name
      ).trim();
  }

  if (
    data.organization_short_name !==
    undefined
  ) {
    updateData.organization_short_name =
      data.organization_short_name
        ? String(
            data.organization_short_name
          ).trim()
        : null;
  }

  if (
    data.address !==
    undefined
  ) {
    updateData.address =
      data.address || null;
  }

  if (
    data.email !==
    undefined
  ) {
    updateData.email =
      data.email || null;
  }

  if (
    data.phone !==
    undefined
  ) {
    updateData.phone =
      data.phone || null;
  }

  if (
    data.website !==
    undefined
  ) {
    updateData.website =
      data.website || null;
  }

  if (
    data.logo_path !==
    undefined
  ) {
    updateData.logo_path =
      data.logo_path || null;
  }

  updateData.updated_by =
    userId;

  await setting.update(
    updateData
  );

  return getActive();
};

const normalizeStoredPath = (
  file
) => {
  if (!file) {
    return null;
  }

  return `storage/letterheads/${file.filename}`;
};

const removeStoredFile = async (
  storedPath
) => {
  if (!storedPath) {
    return;
  }

  const absolutePath =
    path.resolve(
      __dirname,
      "../..",
      storedPath
    );

  try {
    await fs.unlink(
      absolutePath
    );
  } catch (error) {
    if (
      error.code !==
      "ENOENT"
    ) {
      console.error(
        "Gagal menghapus file kop lama:",
        error
      );
    }
  }
};

const uploadLetterheads = async (
  files = {},
  userId
) => {
  await fs.mkdir(
    LETTERHEAD_DIRECTORY,
    {
      recursive: true,
    }
  );

  let setting =
    await getActive();

  if (!setting) {
    setting =
      await createDefault();
  }

  const topFile =
    files.letterhead_top?.[0] ||
    null;

  const bottomFile =
    files.letterhead_bottom?.[0] ||
    null;

  if (!topFile && !bottomFile) {
    throw new Error(
      "Minimal satu file kop surat harus diupload."
    );
  }

  const newTopPath =
    normalizeStoredPath(
      topFile
    );

  const newBottomPath =
    normalizeStoredPath(
      bottomFile
    );

  const oldTopPath =
    setting.letterhead_top_path;

  const oldBottomPath =
    setting.letterhead_bottom_path;

  const updateData = {
    updated_by: userId,
  };

  if (newTopPath) {
    updateData.letterhead_top_path =
      newTopPath;
  }

  if (newBottomPath) {
    updateData.letterhead_bottom_path =
      newBottomPath;
  }

  await setting.update(
    updateData
  );

  if (
    newTopPath &&
    oldTopPath &&
    newTopPath !== oldTopPath
  ) {
    await removeStoredFile(
      oldTopPath
    );
  }

  if (
    newBottomPath &&
    oldBottomPath &&
    newBottomPath !==
      oldBottomPath
  ) {
    await removeStoredFile(
      oldBottomPath
    );
  }

  return getActive();
};

module.exports = {
  getActive,
  createDefault,
  update,
  uploadLetterheads,
};