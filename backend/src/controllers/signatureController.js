const fs = require("fs/promises");

const signatureService = require("../services/signatureService");

const get = async (req, res, next) => {
  try {
    let setting = await signatureService.getActive();

    if (!setting) {
      setting = await signatureService.createDefault();
    }

    return res.status(200).json({
      success: true,
      message: "Konfigurasi tanda tangan berhasil diambil.",
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  let savedFile = null;

  try {
    const currentSetting = await signatureService.getActive();

    if (req.file) {
      savedFile = await signatureService.saveSignatureFile(req.file);
    }

    const data = {
      mode: req.body.mode,
      signer_name: req.body.signer_name,
      signer_position: req.body.signer_position,
    };

    if (savedFile) {
      data.signature_path = savedFile.filePath;
    }

    const setting = await signatureService.update(data, req.user.id);

    if (
      savedFile &&
      currentSetting?.signature_path &&
      currentSetting.signature_path !== savedFile.filePath
    ) {
      await signatureService.removeSignatureFile(currentSetting.signature_path);
    }

    return res.status(200).json({
      success: true,
      message: "Konfigurasi tanda tangan berhasil diperbarui.",
      data: setting,
    });
  } catch (error) {
    if (savedFile) {
      try {
        await fs.unlink(savedFile.absolutePath);
      } catch {
      }
    }

    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {
      }
    }

    next(error);
  }
};

module.exports = {
  get,
  update,
};