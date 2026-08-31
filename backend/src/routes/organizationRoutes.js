const express = require("express");

const organizationController = require(
  "../controllers/organizationController"
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
  "/",
  permissionMiddleware("settings.view"),
  organizationController.get
);

router.put(
  "/",
  permissionMiddleware("settings.update"),
  organizationController.update
);

module.exports = router;