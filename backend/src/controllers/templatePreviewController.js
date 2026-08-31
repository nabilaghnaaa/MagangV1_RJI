const templatePreviewService = require(
  "../services/templatePreviewService"
);

const previewInvitation = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await templatePreviewService.previewInvitation(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Preview surat undangan berhasil dibuat.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const previewAssignment = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await templatePreviewService.previewAssignment(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Preview surat tugas berhasil dibuat.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  previewInvitation,
  previewAssignment,
};