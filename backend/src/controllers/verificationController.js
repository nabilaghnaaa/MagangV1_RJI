const verificationService = require(
  "../services/verificationService"
);

const verify = async (req, res, next) => {
  try {
    const result =
      await verificationService.verify(
        req.params.token
      );

    if (!result.valid) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const generate = async (req, res, next) => {
  try {
    const verification =
      await verificationService.generateVerification(
        req.params.suratId
      );

    return res.status(201).json({
      success: true,
      message:
        "Data verifikasi berhasil dibuat.",
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

const revoke = async (req, res, next) => {
  try {
    const verification =
      await verificationService.revoke(
        req.params.suratId
      );

    return res.status(200).json({
      success: true,
      message:
        "Verifikasi surat berhasil dicabut.",
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verify,
  generate,
  revoke,
};