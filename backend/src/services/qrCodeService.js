const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs/promises");

const QR_DIRECTORY = path.resolve(
  __dirname,
  "../../storage/qrcodes"
);

const ensureDirectory = async () => {
  await fs.mkdir(QR_DIRECTORY, {
    recursive: true,
  });
};

const generateQrCode = async (
  verification
) => {
  if (!verification) {
    throw new Error(
      "Data verification tidak tersedia."
    );
  }

  if (!verification.token) {
    throw new Error(
      "Token verification tidak tersedia."
    );
  }

  await ensureDirectory();

  const fileName = `surat-${verification.surat_id}-${verification.token}.png`;

  const absolutePath = path.join(
    QR_DIRECTORY,
    fileName
  );

  await QRCode.toFile(
    absolutePath,
    verification.verification_url,
    {
      type: "png",
      width: 600,
      margin: 2,
      errorCorrectionLevel: "H",
    }
  );

  return {
    fileName,
    filePath: `storage/qrcodes/${fileName}`,
    absolutePath,
    verificationUrl:
      verification.verification_url,
  };
};

module.exports = {
  generateQrCode,
};