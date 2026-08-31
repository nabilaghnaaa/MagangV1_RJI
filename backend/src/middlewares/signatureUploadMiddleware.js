const multer = require("multer");
const path = require("path");
const fs = require("fs");

const temporaryDirectory = path.resolve(__dirname, "../../storage/temp");

if (!fs.existsSync(temporaryDirectory)) {
  fs.mkdirSync(temporaryDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, temporaryDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `signature-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  if (!allowedExtensions.includes(extension)) {
    return cb(new Error("File tanda tangan harus PNG, JPG, atau JPEG."));
  }

  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    return cb(new Error("Format file tanda tangan tidak valid."));
  }

  cb(null, true);
};

const uploadSignature = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = {
  uploadSignature,
};