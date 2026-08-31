const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs/promises");

const {
  Surat,
  SuratInvitation,
  SuratAssignment,
  Verification,
} = require("../models");

const transporter =
  nodemailer.createTransport({
    host:
      process.env.EMAIL_HOST ||
      "smtp.gmail.com",
    port: Number(
      process.env.EMAIL_PORT ||
      465
    ),
    secure:
      String(
        process.env.EMAIL_SECURE ||
        "true"
      ) === "true",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

const escapeHtml = (
  value
) => {
  return String(value ?? "")
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
};

const getRecipientData = (
  surat
) => {
  if (
    surat.type ===
    "invitation"
  ) {
    if (!surat.invitation) {
      throw new Error(
        "Data pengajuan Surat Undangan tidak ditemukan."
      );
    }

    return {
      name:
        surat.invitation
          .participant_name,
      email:
        surat.invitation
          .participant_email,
      type:
        "Surat Undangan",
    };
  }

  if (
    surat.type ===
    "assignment"
  ) {
    if (!surat.assignment) {
      throw new Error(
        "Data pengajuan Surat Tugas tidak ditemukan."
      );
    }

    return {
      name:
        surat.assignment
          .member_name,
      email:
        surat.assignment
          .member_email,
      type:
        "Surat Tugas",
    };
  }

  throw new Error(
    "Jenis surat tidak dikenali."
  );
};

const getEmailSubject = (
  surat
) => {
  const typeLabel =
    surat.type ===
    "invitation"
      ? "Undangan"
      : "Tugas";

  return `Surat ${typeLabel} - ${surat.letter_number}`;
};

const buildEmailHtml = ({
  surat,
  recipient,
  verification,
}) => {
  const verificationUrl =
    verification?.verification_url ||
    "";

  const organizationName =
    escapeHtml(
      surat.organization_name ||
      "Relawan Jurnal Indonesia"
    );

  const recipientName =
    escapeHtml(
      recipient.name
    );

  const letterNumber =
    escapeHtml(
      surat.letter_number
    );

  const subject =
    escapeHtml(
      surat.subject || "-"
    );

  const verificationHtml =
    verificationUrl
      ? `
        <div style="margin-top:24px;padding:18px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;">
          <div style="font-size:13px;font-weight:700;color:#c2410c;">
            Verifikasi Surat
          </div>

          <div style="margin-top:8px;font-size:13px;line-height:1.6;color:#7c2d12;">
            Surat dapat diverifikasi melalui tautan berikut:
          </div>

          <a href="${escapeHtml(verificationUrl)}" style="display:inline-block;margin-top:12px;color:#ea580c;text-decoration:none;font-size:13px;font-weight:600;word-break:break-all;">
            ${escapeHtml(verificationUrl)}
          </a>
        </div>
      `
      : "";

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${letterNumber}</title>
      </head>

      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#171717;">
        <div style="width:100%;padding:40px 20px;">
          <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
            <div style="padding:28px 32px;background:#171717;color:#ffffff;">
              <div style="font-size:18px;font-weight:700;">
                ${organizationName}
              </div>

              <div style="margin-top:5px;font-size:13px;color:#bdbdbd;">
                Sistem Persuratan
              </div>
            </div>

            <div style="padding:32px;">
              <p style="margin:0;font-size:16px;font-weight:700;">
                Halo ${recipientName},
              </p>

              <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#525252;">
                Kami menginformasikan bahwa ${escapeHtml(recipient.type.toLowerCase())} untuk Anda telah diterbitkan oleh ${organizationName}.
              </p>

              <div style="margin-top:24px;padding:18px;border-radius:12px;background:#fafafa;border:1px solid #eeeeee;">
                <div style="font-size:12px;color:#888888;">
                  Nomor Surat
                </div>

                <div style="margin-top:5px;font-size:15px;font-weight:700;">
                  ${letterNumber}
                </div>

                <div style="margin-top:16px;font-size:12px;color:#888888;">
                  Perihal
                </div>

                <div style="margin-top:5px;font-size:14px;font-weight:600;">
                  ${subject}
                </div>
              </div>

              ${verificationHtml}

              <p style="margin:26px 0 0;font-size:14px;line-height:1.7;color:#525252;">
                Dokumen surat terlampir dalam email ini. Mohon menyimpan dokumen tersebut sebagai arsip.
              </p>

              <p style="margin:26px 0 0;font-size:14px;line-height:1.7;color:#525252;">
                Terima kasih.
              </p>

              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eeeeee;">
                <div style="font-size:13px;font-weight:700;">
                  ${organizationName}
                </div>

                <div style="margin-top:4px;font-size:12px;color:#888888;">
                  Sistem Persuratan
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getSurat = async (
  suratId
) => {
  const surat =
    await Surat.findByPk(
      suratId,
      {
        include: [
          {
            model: SuratInvitation,
            as: "invitation",
          },
          {
            model: SuratAssignment,
            as: "assignment",
          },
          {
            model: Verification,
            as: "verification",
          },
        ],
      }
    );

  if (!surat) {
    throw new Error(
      "Surat tidak ditemukan."
    );
  }

  return surat;
};

const sendSurat = async (
  suratId
) => {
  let surat = null;

  try {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      throw new Error(
        "Konfigurasi email belum lengkap."
      );
    }

    surat =
      await getSurat(
        suratId
      );

    if (
      surat.status ===
      "cancelled"
    ) {
      throw new Error(
        "Surat yang dibatalkan tidak dapat dikirim."
      );
    }

    if (!surat.pdf_path) {
      throw new Error(
        "PDF surat belum tersedia."
      );
    }

    const recipient =
      getRecipientData(
        surat
      );

    if (!recipient.email) {
      throw new Error(
        "Email penerima surat tidak tersedia."
      );
    }

    const absolutePdfPath =
      path.resolve(
        __dirname,
        "../..",
        surat.pdf_path
      );

    try {
      await fs.access(
        absolutePdfPath
      );
    } catch {
      throw new Error(
        "File PDF surat tidak ditemukan."
      );
    }

    const info =
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "Relawan Jurnal Indonesia"}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject:
          getEmailSubject(
            surat
          ),
        html:
          buildEmailHtml({
            surat,
            recipient,
            verification:
              surat.verification,
          }),
        attachments: [
          {
            filename:
              `${surat.letter_number.replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`,
            path:
              absolutePdfPath,
            contentType:
              "application/pdf",
          },
        ],
      });

    await surat.update({
      status: "sent",
      email_status: "sent",
      email_sent_at:
        new Date(),
      email_error: null,
    });

    const updatedSurat =
      await getSurat(
        surat.id
      );

    return {
      messageId:
        info.messageId,
      recipient:
        recipient.email,
      subject:
        getEmailSubject(
          surat
        ),
      surat:
        updatedSurat,
    };
  } catch (error) {
    if (surat) {
      try {
        await surat.update({
          status:
            surat.status ===
            "sent"
              ? "sent"
              : "issued",
          email_status:
            "failed",
          email_error:
            error.message ||
            "Gagal mengirim email.",
        });
      } catch (updateError) {
        console.error(
          "Gagal menyimpan status email:",
          updateError
        );
      }
    }

    throw error;
  }
};

const verifyConnection =
  async () => {
    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      throw new Error(
        "Konfigurasi email belum lengkap."
      );
    }

    await transporter.verify();

    return true;
  };

module.exports = {
  sendSurat,
  verifyConnection,
};