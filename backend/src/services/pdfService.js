const path = require("path");
const fs = require("fs/promises");
const puppeteer = require("puppeteer");

const {
  Surat,
  SuratInvitation,
  SuratAssignment,
  SuratTemplate,
  Verification,
} = require("../models");

const {
  replacePlaceholders,
} = require("./templateRendererService");

const PDF_DIRECTORY = path.resolve(
  __dirname,
  "../../storage/surat"
);

const DEFAULT_LOGO_PATH = path.resolve(
  __dirname,
  "../../../frontend/public/logo-rji.png"
);

const ensureDirectory = async () => {
  await fs.mkdir(
    PDF_DIRECTORY,
    {
      recursive: true,
    }
  );
};

const fileExists = async (
  filePath
) => {
  try {
    await fs.access(
      filePath
    );

    return true;
  } catch {
    return false;
  }
};

const fileToDataUri = async (
  filePath
) => {
  if (
    !filePath ||
    !(await fileExists(filePath))
  ) {
    return null;
  }

  const buffer =
    await fs.readFile(filePath);

  const extension =
    path.extname(
      filePath
    ).toLowerCase();

  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };

  const mimeType =
    mimeTypes[extension] ||
    "application/octet-stream";

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

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

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "long",
    }
  ).format(date);
};

const getActiveTemplate = async (
  type
) => {
  const template =
    await SuratTemplate.findOne({
      where: {
        type,
        is_active: true,
      },
      order: [
        ["created_at", "DESC"],
      ],
    });

  if (!template) {
    throw new Error(
      `Template aktif untuk jenis surat "${type}" belum tersedia.`
    );
  }

  return template;
};

const getSourceData = (
  surat
) => {
  if (
    surat.type ===
    "invitation"
  ) {
    const invitation =
      surat.invitation;

    if (!invitation) {
      throw new Error(
        "Data pengajuan Surat Undangan tidak ditemukan."
      );
    }

    return {
      letter_number:
        surat.letter_number,
      letter_date:
        surat.letter_date,
      subject:
        surat.subject,
      recipient_name:
        surat.recipient_name,
      recipient_email:
        surat.recipient_email,
      participant_name:
        invitation.participant_name,
      participant_email:
        invitation.participant_email,
      participant_phone:
        invitation.participant_phone,
      organization:
        invitation.organization,
      activity_name:
        invitation.activity_name,
      activity_description:
        invitation.activity_description,
      activity_date:
        invitation.activity_date,
      activity_end_date:
        invitation.activity_end_date,
      activity_time:
        invitation.activity_time,
      location:
        invitation.location,
      invitation_subject:
        invitation.invitation_subject,
      notes:
        invitation.notes,
    };
  }

  if (
    surat.type ===
    "assignment"
  ) {
    const assignment =
      surat.assignment;

    if (!assignment) {
      throw new Error(
        "Data pengajuan Surat Tugas tidak ditemukan."
      );
    }

    return {
      letter_number:
        surat.letter_number,
      letter_date:
        surat.letter_date,
      subject:
        surat.subject,
      recipient_name:
        surat.recipient_name,
      recipient_email:
        surat.recipient_email,
      member_name:
        assignment.member_name,
      member_email:
        assignment.member_email,
      member_phone:
        assignment.member_phone,
      member_organization:
        assignment.member_organization,
      member_role:
        assignment.member_role,
      activity_name:
        assignment.activity_name,
      activity_description:
        assignment.activity_description,
      activity_date:
        assignment.activity_date,
      activity_end_date:
        assignment.activity_end_date,
      activity_time:
        assignment.activity_time,
      location:
        assignment.location,
      assignment_subject:
        assignment.assignment_subject,
      request_letter_number:
        assignment.request_letter_number,
      request_letter_date:
        assignment.request_letter_date,
      notes:
        assignment.notes,
    };
  }

  throw new Error(
    "Jenis surat tidak dikenali."
  );
};

const getSignatureContent = async (
  surat
) => {
  const signerName =
    escapeHtml(
      surat.signature_name ||
      "Ketua RJI"
    );

  const signerPosition =
    escapeHtml(
      surat.signature_position ||
      "Ketua RJI"
    );

  if (
    surat.signature_mode ===
      "scan" &&
    surat.signature_path
  ) {
    const signatureAbsolutePath =
      path.resolve(
        __dirname,
        "../..",
        surat.signature_path
      );

    const signatureDataUri =
      await fileToDataUri(
        signatureAbsolutePath
      );

    if (signatureDataUri) {
      return {
        html: `<img src="${signatureDataUri}" class="signature-image" alt="Tanda Tangan ${signerName}" />`,
        signerName,
        signerPosition,
      };
    }

    throw new Error(
      "File tanda tangan pada surat tidak ditemukan."
    );
  }

  if (
    surat.signature_mode ===
    "barcode"
  ) {
    const barcodeValue =
      escapeHtml(
        `${surat.letter_number}|${surat.id}`
      );

    return {
      html: `
        <div class="barcode-placeholder">
          <div class="barcode-lines"></div>
          <div class="barcode-value">${barcodeValue}</div>
        </div>
      `,
      signerName,
      signerPosition,
    };
  }

  return {
    html:
      `<div class="signature-space"></div>`,
    signerName,
    signerPosition,
  };
};

const buildDocumentHtml = async ({
  surat,
  template,
  verification,
}) => {
  const sourceData =
    getSourceData(surat);

  const content =
    replacePlaceholders(
      template.content,
      sourceData
    );

  const footer =
    replacePlaceholders(
      template.footer || "",
      sourceData
    );

  const logoPath =
    surat.organization_logo_path
      ? path.resolve(
          __dirname,
          "../..",
          surat.organization_logo_path
        )
      : process.env.RJI_LOGO_PATH ||
        DEFAULT_LOGO_PATH;

  const logoDataUri =
    await fileToDataUri(
      logoPath
    );

  let qrDataUri = null;

  if (
    verification?.qr_path
  ) {
    const qrAbsolutePath =
      path.resolve(
        __dirname,
        "../..",
        verification.qr_path
      );

    qrDataUri =
      await fileToDataUri(
        qrAbsolutePath
      );
  }

  const signatureContent =
    await getSignatureContent(
      surat
    );

  const organizationName =
    escapeHtml(
      surat.organization_name ||
      "Relawan Jurnal Indonesia"
    );

  const organizationShortName =
    escapeHtml(
      surat.organization_short_name ||
      "RJI"
    );

  const organizationAddress =
    escapeHtml(
      surat.organization_address ||
      ""
    );

  const organizationEmail =
    escapeHtml(
      surat.organization_email ||
      ""
    );

  const organizationPhone =
    escapeHtml(
      surat.organization_phone ||
      ""
    );

  const organizationWebsite =
    escapeHtml(
      surat.organization_website ||
      ""
    );

  const organizationContact = [
    organizationAddress,
    organizationEmail,
    organizationPhone,
    organizationWebsite,
  ]
    .filter(Boolean)
    .join(" · ");

  const logoHtml =
    logoDataUri
      ? `<img src="${logoDataUri}" class="logo" alt="Logo ${organizationShortName}" />`
      : `<div class="logo-placeholder">${organizationShortName}</div>`;

  const qrHtml =
    qrDataUri
      ? `
        <div class="verification-box">
          <img src="${qrDataUri}" class="qr-code" alt="QR Code Verifikasi" />
          <div class="verification-text">Scan untuk memverifikasi surat</div>
        </div>
      `
      : `
        <div class="verification-box verification-box-empty"></div>
      `;

  const letterNumber =
    escapeHtml(
      surat.letter_number
    );

  const recipientName =
    escapeHtml(
      surat.recipient_name
    );

  const subject =
    escapeHtml(
      surat.subject || "-"
    );

  const verificationText =
    verification?.verification_url
      ? `Verifikasi: ${escapeHtml(verification.verification_url)}`
      : "Data verifikasi belum tersedia.";

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>${letterNumber}</title>

        <style>
          @page {
            size: A4;
            margin: 18mm 20mm 18mm 20mm;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #171717;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.65;
          }

          body {
            width: 100%;
          }

          .document {
            width: 100%;
            min-height: 257mm;
          }

          .letter-head {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f7941d;
          }

          .logo {
            width: 68px;
            height: 68px;
            object-fit: contain;
          }

          .logo-placeholder {
            width: 68px;
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #f7941d;
            color: #ffffff;
            font-weight: 800;
            font-size: 20px;
          }

          .organization-name {
            font-size: 15pt;
            font-weight: 700;
            line-height: 1.25;
          }

          .organization-short-name {
            margin-top: 2px;
            color: #555555;
            font-size: 10pt;
            font-weight: 600;
          }

          .organization-contact {
            margin-top: 4px;
            color: #777777;
            font-size: 8pt;
            line-height: 1.4;
          }

          .document-content {
            margin-top: 25px;
          }

          .letter-meta {
            margin-bottom: 22px;
          }

          .letter-meta table {
            width: 100%;
            border-collapse: collapse;
          }

          .letter-meta td {
            padding: 2px 0;
            vertical-align: top;
          }

          .letter-meta td:first-child {
            width: 90px;
            font-weight: 600;
          }

          .document-content p {
            margin-top: 0;
            margin-bottom: 12px;
          }

          .footer-content {
            margin-top: 20px;
          }

          .signature-section {
            margin-top: 42px;
            display: flex;
            justify-content: flex-end;
          }

          .signature {
            width: 210px;
            text-align: center;
          }

          .signature-title {
            margin-bottom: 8px;
          }

          .signature-space {
            height: 75px;
          }

          .signature-image {
            display: block;
            width: 145px;
            height: 70px;
            object-fit: contain;
            margin: 2px auto 4px;
          }

          .signature-name {
            margin-top: 4px;
            font-weight: 700;
            text-decoration: underline;
          }

          .signature-position {
            margin-top: 2px;
            color: #555555;
            font-size: 9pt;
          }

          .barcode-placeholder {
            width: 170px;
            height: 80px;
            margin: 0 auto 2px;
            text-align: center;
          }

          .barcode-lines {
            width: 145px;
            height: 52px;
            margin: 0 auto;
            background: repeating-linear-gradient(
              90deg,
              #171717 0px,
              #171717 2px,
              #ffffff 2px,
              #ffffff 4px,
              #171717 4px,
              #171717 5px,
              #ffffff 5px,
              #ffffff 8px
            );
          }

          .barcode-value {
            margin-top: 4px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 6.5pt;
            line-height: 1.2;
            word-break: break-all;
            color: #555555;
          }

          .verification-section {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #e5e5e5;
          }

          .verification-info {
            max-width: 70%;
            font-size: 8.5pt;
            color: #777777;
            overflow-wrap: anywhere;
          }

          .verification-box {
            width: 100px;
            text-align: center;
          }

          .verification-box-empty {
            min-height: 84px;
          }

          .qr-code {
            display: block;
            width: 84px;
            height: 84px;
            margin: 0 auto;
          }

          .verification-text {
            margin-top: 5px;
            font-size: 7.5pt;
            line-height: 1.3;
            color: #777777;
          }

          .avoid-break {
            page-break-inside: avoid;
          }
        </style>
      </head>

      <body>
        <div class="document">
          <header class="letter-head">
            ${logoHtml}

            <div>
              <div class="organization-name">${organizationName}</div>
              <div class="organization-short-name">${organizationShortName}</div>

              ${
                organizationContact
                  ? `<div class="organization-contact">${organizationContact}</div>`
                  : ""
              }
            </div>
          </header>

          <main class="document-content">
            <div class="letter-meta">
              <table>
                <tr>
                  <td>Nomor</td>
                  <td>: ${letterNumber}</td>
                </tr>

                <tr>
                  <td>Tanggal</td>
                  <td>: ${escapeHtml(formatDate(surat.letter_date))}</td>
                </tr>

                <tr>
                  <td>Perihal</td>
                  <td>: ${subject}</td>
                </tr>
              </table>
            </div>

            <p>Yth. <strong>${recipientName}</strong></p>

            ${content}

            ${
              footer
                ? `<div class="footer-content">${footer}</div>`
                : ""
            }

            <div class="signature-section avoid-break">
              <div class="signature">
                <div class="signature-title">Hormat kami,</div>
                ${signatureContent.html}
                <div class="signature-name">${signatureContent.signerName}</div>
                <div class="signature-position">${signatureContent.signerPosition}</div>
              </div>
            </div>

            <div class="verification-section avoid-break">
              <div class="verification-info">
                Dokumen ini diterbitkan melalui Sistem Persuratan ${organizationShortName}.
                <br />
                Nomor Surat: ${letterNumber}
                <br />
                ${verificationText}
              </div>

              ${qrHtml}
            </div>
          </main>
        </div>
      </body>
    </html>
  `;
};

const generatePdf = async (
  suratId
) => {
  await ensureDirectory();

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

  if (
    surat.pdf_path &&
    surat.status === "sent"
  ) {
    const existingAbsolutePath =
      path.resolve(
        __dirname,
        "../..",
        surat.pdf_path
      );

    if (
      await fileExists(
        existingAbsolutePath
      )
    ) {
      return {
        surat,
        fileName:
          path.basename(
            surat.pdf_path
          ),
        filePath:
          surat.pdf_path,
        absolutePath:
          existingAbsolutePath,
      };
    }
  }

  let template;

  if (surat.template_content) {
    template = {
      id:
        surat.template_id,
      name:
        surat.template_name,
      content:
        surat.template_content,
      footer:
        surat.template_footer || "",
    };
  } else {
    template =
      await getActiveTemplate(
        surat.type
      );
  }

  const html =
    await buildDocumentHtml({
      surat,
      template,
      verification:
        surat.verification,
    });

  const safeFileName =
    surat.letter_number.replace(
      /[^a-zA-Z0-9-_]/g,
      "_"
    );

  const fileName =
    `${safeFileName}.pdf`;

  const absolutePath =
    path.join(
      PDF_DIRECTORY,
      fileName
    );

  const relativePath =
    `storage/surat/${fileName}`;

  const browser =
    await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

  try {
    const page =
      await browser.newPage();

    await page.setContent(
      html,
      {
        waitUntil:
          "networkidle0",
      }
    );

    await page.pdf({
      path: absolutePath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "18mm",
        right: "20mm",
        bottom: "18mm",
        left: "20mm",
      },
    });
  } finally {
    await browser.close();
  }

  await Surat.update(
    {
      pdf_path:
        relativePath,
      pdf_generated_at:
        new Date(),
    },
    {
      where: {
        id: suratId,
      },
    }
  );

  const updatedSurat =
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

  return {
    surat:
      updatedSurat,
    fileName,
    filePath:
      relativePath,
    absolutePath,
  };
};

module.exports = {
  generatePdf,
};