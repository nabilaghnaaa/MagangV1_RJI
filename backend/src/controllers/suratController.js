const suratService = require(
  "../services/suratService"
);

const pdfService = require(
  "../services/pdfService"
);

const getAll = async (
  req,
  res,
  next
) => {
  try {
    const surat =
      await suratService.getAll(
        req.query
      );

    return res.status(200).json({
      success: true,
      message:
        "Data surat berhasil diambil.",
      data: surat,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (
  req,
  res,
  next
) => {
  try {
    const surat =
      await suratService.getById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Detail surat berhasil diambil.",
      data: surat,
    });
  } catch (error) {
    next(error);
  }
};

const generatePdf = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await pdfService.generatePdf(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "PDF surat berhasil dibuat.",
      data: {
        surat: result.surat,
        file_name:
          result.fileName,
        file_path:
          result.filePath,
      },
    });
  } catch (error) {
    next(error);
  }
};

const downloadPdf = async (
  req,
  res,
  next
) => {
  try {
    const surat =
      await suratService.getById(
        req.params.id
      );

    if (!surat.pdf_path) {
      await pdfService.generatePdf(
        req.params.id
      );

      surat.pdf_path =
        (
          await suratService.getById(
            req.params.id
          )
        ).pdf_path;
    }

    const path = require("path");

    const absolutePath =
      path.resolve(
        __dirname,
        "../..",
        surat.pdf_path
      );

    return res.download(
      absolutePath,
      `${surat.letter_number}.pdf`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  generatePdf,
  downloadPdf,
};