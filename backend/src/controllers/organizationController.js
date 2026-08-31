const organizationService = require(
  "../services/organizationService"
);

const get = async (req, res, next) => {
  try {
    let setting =
      await organizationService.getActive();

    if (!setting) {
      setting =
        await organizationService.createDefault();
    }

    return res.status(200).json({
      success: true,
      message:
        "Konfigurasi organisasi berhasil diambil.",
      data: setting,
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
    const setting =
      await organizationService.update(
        req.body,
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Konfigurasi organisasi berhasil diperbarui.",
      data: setting,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  update,
};