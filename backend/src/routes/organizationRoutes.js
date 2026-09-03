const express = require("express");

const organizationController = require(
  "../controllers/organizationController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware =
  require(
    "../middlewares/permissionMiddleware"
  );

const {
  uploadLetterheads,
} = require(
  "../middlewares/uploadMiddleware"
);

const router =
  express.Router();

router.get(
  "/",
  authMiddleware,
  permissionMiddleware(
    "settings.view"
  ),
  organizationController.get
);

router.put(
  "/",
  authMiddleware,
  permissionMiddleware(
    "settings.update"
  ),
  organizationController.update
);

router.post(
  "/letterheads",
  authMiddleware,
  permissionMiddleware(
    "settings.update"
  ),
  uploadLetterheads.fields([
    {
      name: "letterhead_top",
      maxCount: 1,
    },
    {
      name: "letterhead_bottom",
      maxCount: 1,
    },
  ]),
  organizationController.uploadLetterheads
);

module.exports = router;