const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const assignmentUploadDirectory =
  path.resolve(
    __dirname,
    "../../storage/uploads/assignments"
  );

const letterheadUploadDirectory =
  path.resolve(
    __dirname,
    "../../storage/letterheads"
  );

fs.mkdirSync(
  assignmentUploadDirectory,
  {
    recursive: true,
  }
);

fs.mkdirSync(
  letterheadUploadDirectory,
  {
    recursive: true,
  }
);

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

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
];

const assignmentStorage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        assignmentUploadDirectory
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        ).toLowerCase();

      const randomName =
        crypto
          .randomBytes(16)
          .toString("hex");

      cb(
        null,
        `${Date.now()}-${randomName}${extension}`
      );
    },
  });

const letterheadStorage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(
        null,
        letterheadUploadDirectory
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {
      const extension =
        path.extname(
          file.originalname
        ).toLowerCase();

      const randomName =
        crypto
          .randomBytes(16)
          .toString("hex");

      cb(
        null,
        `${Date.now()}-${randomName}${extension}`
      );
    },
  });

const assignmentFileFilter = (
  req,
  file,
  cb
) => {
  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  if (
    !allowedMimeTypes.includes(
      file.mimetype
    ) ||
    !allowedExtensions.includes(
      extension
    )
  ) {
    return cb(
      new Error(
        "Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG."
      )
    );
  }

  cb(null, true);
};

const letterheadFileFilter = (
  req,
  file,
  cb
) => {
  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  if (
    !imageMimeTypes.includes(
      file.mimetype
    ) ||
    ![
      ".png",
      ".jpg",
      ".jpeg",
    ].includes(extension)
  ) {
    return cb(
      new Error(
        "Kop surat hanya boleh menggunakan PNG, JPG, atau JPEG."
      )
    );
  }

  cb(null, true);
};

const uploadAssignmentAttachment =
  multer({
    storage: assignmentStorage,
    fileFilter:
      assignmentFileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

const uploadLetterheads =
  multer({
    storage:
      letterheadStorage,
    fileFilter:
      letterheadFileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

module.exports = {
  uploadAssignmentAttachment,
  uploadLetterheads,
};