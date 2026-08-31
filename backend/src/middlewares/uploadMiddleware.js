const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.resolve(
  __dirname,
  "../../storage/uploads/assignments"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const allowedExtensions = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    ).toLowerCase();

    const randomName = crypto
      .randomBytes(16)
      .toString("hex");

    cb(
      null,
      `${Date.now()}-${randomName}${extension}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(
    file.originalname
  ).toLowerCase();

  if (
    !allowedMimeTypes.includes(file.mimetype) ||
    !allowedExtensions.includes(extension)
  ) {
    return cb(
      new Error(
        "Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG."
      )
    );
  }

  cb(null, true);
};

const uploadAssignmentAttachment = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadAssignmentAttachment,
};