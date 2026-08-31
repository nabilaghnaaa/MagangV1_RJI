const express = require("express");

const templatePreviewController = require(
  "../controllers/templatePreviewController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/invitation/:id",
  permissionMiddleware("template.view"),
  templatePreviewController.previewInvitation
);

router.get(
  "/assignment/:id",
  permissionMiddleware("template.view"),
  templatePreviewController.previewAssignment
);

module.exports = router;