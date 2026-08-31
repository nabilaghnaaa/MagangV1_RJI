const multer = require("multer");

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "Ukuran file maksimal 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "Terjadi kesalahan saat upload file.",
    });
  }

  return res.status(500).json({
    success: false,
    message:
      err.message ||
      "Terjadi kesalahan pada server.",
  });
};

module.exports = errorMiddleware;