const express = require("express");

const signatureController = require("../controllers/signatureController");

const authMiddleware = require("../middlewares/authMiddleware");
const permissionMiddleware = require("../middlewares/permissionMiddleware");

const { uploadSignature } = require("../middlewares/signatureUploadMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  permissionMiddleware("signature.view"),
  signatureController.get
);

router.put(
  "/",
  permissionMiddleware("signature.update"),
  uploadSignature.single("signature"),
  signatureController.update
);

module.exports = router;