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

const CSS_PATH = path.join(
  __dirname,
  "css",
  "pdfService.css"
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
    await fs.readFile(
      filePath
    );

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

const loadPdfCss = async () => {
  try {
    return await fs.readFile(
      CSS_PATH,
      "utf8"
    );
  } catch (error) {
    console.error(
      "Gagal membaca CSS PDF:",
      error
    );

    throw new Error(
      "File CSS PDF tidak ditemukan."
    );
  }
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

    if (!signatureDataUri) {
      throw new Error(
        "File tanda tangan pada surat tidak ditemukan."
      );
    }

    return {
      html: `<img src="${signatureDataUri}" class="signature-image" alt="Tanda Tangan ${signerName}" />`,
      signerName,
      signerPosition,
    };
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
          <div class="barcode-value">
            ${barcodeValue}
          </div>
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

const getLetterheadContent =
  async (surat) => {
    let topDataUri = null;
    let bottomDataUri = null;

    if (
      surat.letterhead_top_path
    ) {
      const topAbsolutePath =
        path.resolve(
          __dirname,
          "../..",
          surat.letterhead_top_path
        );

      topDataUri =
        await fileToDataUri(
          topAbsolutePath
        );

      if (!topDataUri) {
        throw new Error(
          "File kop surat bagian atas tidak ditemukan."
        );
      }
    }

    if (
      surat.letterhead_bottom_path
    ) {
      const bottomAbsolutePath =
        path.resolve(
          __dirname,
          "../..",
          surat.letterhead_bottom_path
        );

      bottomDataUri =
        await fileToDataUri(
          bottomAbsolutePath
        );

      if (!bottomDataUri) {
        throw new Error(
          "File kop surat bagian bawah tidak ditemukan."
        );
      }
    }

    return {
      topDataUri,
      bottomDataUri,
    };
  };

const buildFallbackHeader =
  async (surat) => {
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

    if (logoDataUri) {
      return `
        <header class="fallback-letter-head">
          <img
            src="${logoDataUri}"
            class="fallback-logo"
            alt="Logo ${organizationShortName}"
          />

          <div>
            <div class="organization-name">
              ${organizationName}
            </div>

            <div class="organization-short-name">
              ${organizationShortName}
            </div>
          </div>
        </header>
      `;
    }

    return `
      <header class="fallback-letter-head">
        <div class="fallback-logo-placeholder">
          ${organizationShortName}
        </div>

        <div>
          <div class="organization-name">
            ${organizationName}
          </div>

          <div class="organization-short-name">
            ${organizationShortName}
          </div>
        </div>
      </header>
    `;
  };

const buildDocumentHtml =
  async ({
    surat,
    template,
    verification,
  }) => {
    const sourceData =
      getSourceData(
        surat
      );

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

    const signatureContent =
      await getSignatureContent(
        surat
      );

    const letterhead =
      await getLetterheadContent(
        surat
      );

    const css =
      await loadPdfCss();

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

    const organizationShortName =
      escapeHtml(
        surat.organization_short_name ||
        "RJI"
      );

    const letterheadTopHtml =
      letterhead.topDataUri
        ? `
          <img
            src="${letterhead.topDataUri}"
            class="letterhead-image letterhead-top"
            alt="Kop Surat Atas"
          />
        `
        : await buildFallbackHeader(
            surat
          );

    const letterheadBottomHtml =
      letterhead.bottomDataUri
        ? `
          <img
            src="${letterhead.bottomDataUri}"
            class="letterhead-image letterhead-bottom"
            alt="Kop Surat Bawah"
          />
        `
        : "";

    const qrHtml =
      verification?.qr_path
        ? `
          <div class="verification-box">
            ${
              await fileToDataUri(
                path.resolve(
                  __dirname,
                  "../..",
                  verification.qr_path
                )
              )
            }

            <div class="verification-text">
              Scan untuk memverifikasi surat
            </div>
          </div>
        `
        : `
          <div class="verification-box verification-box-empty"></div>
        `;

    let verifiedQrDataUri = null;

    if (
      verification?.qr_path
    ) {
      const qrAbsolutePath =
        path.resolve(
          __dirname,
          "../..",
          verification.qr_path
        );

      verifiedQrDataUri =
        await fileToDataUri(
          qrAbsolutePath
        );
    }

    const finalQrHtml =
      verifiedQrDataUri
        ? `
          <div class="verification-box">
            <img
              src="${verifiedQrDataUri}"
              class="qr-code"
              alt="QR Code Verifikasi"
            />

            <div class="verification-text">
              Scan untuk memverifikasi surat
            </div>
          </div>
        `
        : `
          <div class="verification-box verification-box-empty"></div>
        `;

    const verificationText =
      verification?.verification_url
        ? `Verifikasi: ${escapeHtml(
            verification.verification_url
          )}`
        : "Data verifikasi belum tersedia.";

    return `
      <!DOCTYPE html>

      <html lang="id">
        <head>
          <meta charset="UTF-8" />

          <title>
            ${letterNumber}
          </title>

          <style>
            ${css}
          </style>
        </head>

        <body>
          <div class="document">
            ${letterheadTopHtml}

            <main class="document-body">
              <div class="letter-meta">
                <table>
                  <tr>
                    <td>Nomor</td>
                    <td>
                      : ${letterNumber}
                    </td>
                  </tr>

                  <tr>
                    <td>Tanggal</td>
                    <td>
                      : ${escapeHtml(
                        formatDate(
                          surat.letter_date
                        )
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Perihal</td>
                    <td>
                      : ${subject}
                    </td>
                  </tr>
                </table>
              </div>

              <p>
                Yth.
                <strong>
                  ${recipientName}
                </strong>
              </p>

              <div class="template-content">
                ${content}
              </div>

              ${
                footer
                  ? `
                    <div class="footer-content">
                      ${footer}
                    </div>
                  `
                  : ""
              }

              <div class="signature-section avoid-break">
                <div class="signature">
                  <div class="signature-title">
                    Hormat kami,
                  </div>

                  ${signatureContent.html}

                  <div class="signature-name">
                    ${signatureContent.signerName}
                  </div>

                  <div class="signature-position">
                    ${signatureContent.signerPosition}
                  </div>
                </div>
              </div>

              <div class="verification-section avoid-break">
                <div class="verification-info">
                  Dokumen ini diterbitkan melalui Sistem Persuratan ${organizationShortName}.
                  <br />
                  Nomor Surat:
                  ${letterNumber}
                  <br />
                  ${verificationText}
                </div>

                ${finalQrHtml}
              </div>
            </main>

            ${letterheadBottomHtml}
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

  if (
    surat.template_content
  ) {
    template = {
      id:
        surat.template_id,

      name:
        surat.template_name,

      content:
        surat.template_content,

      footer:
        surat.template_footer ||
        "",
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

    await page.setViewport({
      width: 1900,
      height: 1200,
      deviceScaleFactor: 1,
    });

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