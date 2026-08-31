const permissionMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User belum terautentikasi.",
      });
    }

    const permissions =
      req.user.role?.permissions?.map(
        (permission) => permission.name
      ) || [];

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke resource ini.",
      });
    }

    next();
  };
};

module.exports = permissionMiddleware;