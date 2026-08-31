const crypto = require("crypto");

const {
  Verification,
  Surat,
} = require("../models");

const qrCodeService = require(
  "./qrCodeService"
);

const getBaseUrl = () => {
  return (
    process.env.APP_URL ||
    "http://localhost:5173"
  );
};

const generateVerification = async (
  suratId,
  transaction = null
) => {
  const surat =
    await Surat.findByPk(
      suratId,
      {
        transaction,
      }
    );

  if (!surat) {
    throw new Error(
      "Surat tidak ditemukan."
    );
  }

  const existing =
    await Verification.findOne({
      where: {
        surat_id: suratId,
      },

      transaction,
    });

  if (existing) {
    return existing;
  }

  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  const verificationUrl =
    `${getBaseUrl()}/verify/${token}`;

  const verification =
    await Verification.create(
      {
        surat_id: suratId,

        token,

        verification_url:
          verificationUrl,

        status: "active",

        verified_count: 0,

        last_verified_at: null,

        qr_path: null,

        qr_generated_at: null,
      },
      {
        transaction,
      }
    );

  /*
  |--------------------------------------------------------------------------
  | QR generation
  |--------------------------------------------------------------------------
  |
  | Untuk sementara QR file dibuat setelah record
  | verification berhasil dibuat.
  |
  |--------------------------------------------------------------------------
  */

  const qr =
    await qrCodeService.generateQrCode(
      verification
    );

  await verification.update(
    {
      qr_path: qr.filePath,
      qr_generated_at: new Date(),
    },
    {
      transaction,
    }
  );

  return verification;
};

const verify = async (token) => {
  const verification =
    await Verification.findOne({
      where: {
        token,
        status: "active",
      },

      include: [
        {
          model: Surat,
          as: "surat",
          attributes: [
            "id",
            "type",
            "letter_number",
            "letter_date",
            "subject",
            "recipient_name",
            "recipient_email",
            "status",
          ],
        },
      ],
    });

  if (!verification) {
    return {
      valid: false,
      message:
        "Surat tidak ditemukan atau QR sudah tidak berlaku.",
    };
  }

  await verification.update({
    verified_count:
      verification.verified_count + 1,

    last_verified_at:
      new Date(),
  });

  return {
    valid: true,

    message:
      "Surat terverifikasi.",

    data: {
      surat: verification.surat,

      verification: {
        id: verification.id,

        token: verification.token,

        verification_url:
          verification.verification_url,

        status:
          verification.status,

        verified_count:
          verification.verified_count,

        last_verified_at:
          verification.last_verified_at,

        qr_path:
          verification.qr_path,
      },
    },
  };
};

const revoke = async (
  suratId
) => {
  const verification =
    await Verification.findOne({
      where: {
        surat_id: suratId,
      },
    });

  if (!verification) {
    throw new Error(
      "Data verifikasi tidak ditemukan."
    );
  }

  await verification.update({
    status: "revoked",
  });

  return verification;
};

module.exports = {
  generateVerification,
  verify,
  revoke,
};