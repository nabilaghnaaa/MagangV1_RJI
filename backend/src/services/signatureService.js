const fs = require("fs/promises");
const path = require("path");

const {
  SignatureSetting,
  User,
} = require("../models");

const SIGNATURE_DIRECTORY = path.resolve(__dirname, "../../storage/signatures");

const ensureDirectory = async () => {
  await fs.mkdir(SIGNATURE_DIRECTORY, { recursive: true });
};

const getActive = async () => {
  return SignatureSetting.findOne({
    where: {
      is_active: true,
    },
    include: [
      {
        model: User,
        as: "updater",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["id", "DESC"]],
  });
};

const createDefault = async () => {
  const existing = await SignatureSetting.findOne({
    where: {
      is_active: true,
    },
  });

  if (existing) {
    return existing;
  }

  return SignatureSetting.create({
    mode: "scan",
    signer_name: "Ketua RJI",
    signer_position: "Ketua RJI",
    signature_path: null,
    is_active: true,
    updated_by: null,
  });
};

const update = async (data = {}, adminId) => {
  await ensureDirectory();

  let setting = await getActive();

  if (!setting) {
    setting = await createDefault();
  }

  const updateData = {};

  if (data.mode !== undefined) {
    if (!["scan", "barcode"].includes(data.mode)) {
      throw new Error("Mode tanda tangan tidak valid.");
    }

    updateData.mode = data.mode;
  }

  if (data.signer_name !== undefined) {
    if (!String(data.signer_name).trim()) {
      throw new Error("Nama penanda tangan wajib diisi.");
    }

    updateData.signer_name = String(data.signer_name).trim();
  }

  if (data.signer_position !== undefined) {
    if (!String(data.signer_position).trim()) {
      throw new Error("Jabatan penanda tangan wajib diisi.");
    }

    updateData.signer_position = String(data.signer_position).trim();
  }

  if (data.signature_path !== undefined) {
    updateData.signature_path = data.signature_path || null;
  }

  updateData.updated_by = adminId;

  await setting.update(updateData);

  return getActive();
};

const saveSignatureFile = async (file) => {
  await ensureDirectory();

  if (!file) {
    throw new Error("File tanda tangan tidak tersedia.");
  }

  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(extension)) {
    throw new Error("File tanda tangan harus PNG, JPG, atau JPEG.");
  }

  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new Error("Format file tanda tangan tidak valid.");
  }

  const storedName = `signature-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
  const destination = path.join(SIGNATURE_DIRECTORY, storedName);

  await fs.rename(file.path, destination);

  return {
    fileName: storedName,
    filePath: `storage/signatures/${storedName}`,
    absolutePath: destination,
  };
};

const removeSignatureFile = async (signaturePath) => {
  if (!signaturePath) {
    return;
  }

  const absolutePath = path.resolve(__dirname, "../..", signaturePath);

  try {
    await fs.unlink(absolutePath);
  } catch {
  }
};

module.exports = {
  getActive,
  createDefault,
  update,
  saveSignatureFile,
  removeSignatureFile,
};