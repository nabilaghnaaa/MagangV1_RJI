const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = req.user;

    const permissions =
      user.role?.permissions?.map(
        (permission) => permission.name
      ) || [];

    return res.status(200).json({
      success: true,
      message: "Data user berhasil diambil.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
        permissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  me,
};