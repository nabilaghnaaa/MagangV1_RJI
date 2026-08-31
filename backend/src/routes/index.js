const express = require("express");

const authRoutes = require("./authRoutes");
const invitationRoutes = require("./invitationRoutes");
const assignmentRoutes = require("./assignmentRoutes");
const suratRoutes = require("./suratRoutes");
const templateRoutes = require("./templateRoutes");
const verificationRoutes = require("./verificationRoutes");
const signatureRoutes = require("./signatureRoutes");

const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");
const templatePreviewRoutes = require("./templatePreviewRoutes");
const organizationRoutes = require("./organizationRoutes");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/invitations", invitationRoutes);

router.use("/assignments", assignmentRoutes);

router.use("/surat", suratRoutes);

router.use("/templates", templateRoutes);

router.use("/verification", verificationRoutes);

router.use("/signature", signatureRoutes);

router.use(
  "/template-preview",
  templatePreviewRoutes
);

router.get(
  "/test-protected",
  authMiddleware,
  (req, res) => {
    return res.status(200).json({
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
    return res.status(200).json({
      success: true,
      message: "Permission dashboard.view berhasil.",
    });
  }
);

router.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

router.use(
  "/organization",
  organizationRoutes
);

module.exports = router;