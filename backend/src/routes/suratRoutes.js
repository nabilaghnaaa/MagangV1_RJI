const express = require("express");

const suratController = require(
  "../controllers/suratController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const router = express.Router();

router.use(
  authMiddleware
);

/*
|--------------------------------------------------------------------------
| LIST
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  permissionMiddleware(
    "surat.view"
  ),
  suratController.getAll
);

/*
|--------------------------------------------------------------------------
| DETAIL
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  permissionMiddleware(
    "surat.view"
  ),
  suratController.getById
);

/*
|--------------------------------------------------------------------------
| GENERATE PDF
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/pdf",
  permissionMiddleware(
    "surat.view"
  ),
  suratController.generatePdf
);

/*
|--------------------------------------------------------------------------
| DOWNLOAD PDF
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/pdf",
  permissionMiddleware(
    "surat.view"
  ),
  suratController.downloadPdf
);

module.exports = router;