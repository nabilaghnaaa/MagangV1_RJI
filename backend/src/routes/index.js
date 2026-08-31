const express = require("express");

const authRoutes = require("./authRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const router = express.Router();

router.use("/auth", authRoutes);

router.get(
  "/test-protected",
  authMiddleware,
  (req, res) => {
    return res.json({
      success: true,
      message: "Protected route berhasil diakses.",
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  }
);

router.get(
  "/test-permission",
  authMiddleware,
  permissionMiddleware("dashboard.view"),
  (req, res) => {
    return res.json({
      success: true,
      message: "Permission dashboard.view berhasil.",
    });
  }
);

module.exports = router;