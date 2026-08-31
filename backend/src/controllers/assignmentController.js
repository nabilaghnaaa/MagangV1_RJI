const assignmentService = require("../services/assignmentService");

const create = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const assignment = await assignmentService.create(
      req.body || {},
      req.file || null
    );

    return res.status(201).json({
      success: true,
      message: "Pengajuan surat tugas berhasil dikirim.",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await assignmentService.getAll(
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Data pengajuan surat tugas berhasil diambil.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const assignment =
      await assignmentService.getById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message: "Detail pengajuan surat tugas berhasil diambil.",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const assignment =
      await assignmentService.update(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat tugas berhasil diperbarui.",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const review = async (req, res, next) => {
  try {
    const assignment =
      await assignmentService.review(
        req.params.id,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat tugas berhasil direview.",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const approve = async (req, res, next) => {
  try {
    const assignment =
      await assignmentService.approve(
        req.params.id,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat tugas berhasil disetujui dan surat diterbitkan",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

const reject = async (req, res, next) => {
  try {
    const assignment =
      await assignmentService.reject(
        req.params.id,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat tugas berhasil ditolak.",
      data: assignment,
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
  review,
  approve,
  reject,
};