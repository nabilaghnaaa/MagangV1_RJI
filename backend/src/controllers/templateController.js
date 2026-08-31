const templateService = require(
  "../services/templateService"
);

const create = async (
  req,
  res,
  next
) => {
  try {
    const template =
      await templateService.create(
        req.body,
        req.user.id
      );

    return res.status(201).json({
      success: true,
      message:
        "Template surat berhasil dibuat.",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (
  req,
  res,
  next
) => {
  try {
    const templates =
      await templateService.getAll(
        req.query
      );

    return res.status(200).json({
      success: true,
      message:
        "Data template berhasil diambil.",
      data: templates,
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
    const template =
      await templateService.getById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Detail template berhasil diambil.",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req,
  res,
  next
) => {
  try {
    const template =
      await templateService.update(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Template surat berhasil diperbarui.",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req,
  res,
  next
) => {
  try {
    await templateService.remove(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Template surat berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};

const activate = async (
  req,
  res,
  next
) => {
  try {
    const template =
      await templateService.activate(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Template berhasil diaktifkan.",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

const deactivate = async (
  req,
  res,
  next
) => {
  try {
    const template =
      await templateService.deactivate(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Template berhasil dinonaktifkan.",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  activate,
  deactivate,
};