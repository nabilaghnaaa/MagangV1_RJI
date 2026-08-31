const invitationService = require("../services/invitationService");

const create = async (req, res, next) => {
  try {
    const invitation = await invitationService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Pengajuan surat undangan berhasil dikirim.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await invitationService.getAll(req.query);

    return res.status(200).json({
      success: true,
      message: "Data pengajuan surat undangan berhasil diambil.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const invitation = await invitationService.getById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Detail pengajuan surat undangan berhasil diambil.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const invitation = await invitationService.update(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat undangan berhasil diperbarui.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

const review = async (req, res, next) => {
  try {
    const invitation = await invitationService.review(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat undangan berhasil direview.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

const approve = async (req, res, next) => {
  try {
    const invitation = await invitationService.approve(
      req.params.id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat undangan berhasil disetujui.",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};

const reject = async (req, res, next) => {
  try {
    const invitation = await invitationService.reject(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Pengajuan surat undangan berhasil ditolak.",
      data: invitation,
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