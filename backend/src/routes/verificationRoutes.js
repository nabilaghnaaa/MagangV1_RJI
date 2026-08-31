const express = require("express");

const verificationController = require(
  "../controllers/verificationController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Dipanggil ketika QR Code surat discan.
|--------------------------------------------------------------------------
*/

router.get(
  "/:token",
  verificationController.verify
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.post(
  "/surat/:suratId",
  authMiddleware,
  permissionMiddleware(
    "verification.view"
  ),
  verificationController.generate
);

router.delete(
  "/surat/:suratId",
  authMiddleware,
  permissionMiddleware(
    "verification.view"
  ),
  verificationController.revoke
);

module.exports = router;