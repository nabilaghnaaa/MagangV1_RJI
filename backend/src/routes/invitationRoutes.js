const express = require("express");

const invitationController = require(
  "../controllers/invitationController"
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
| Peserta mengisi form tanpa login.
*/

router.post(
  "/",
  invitationController.create
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("submission.view"),
  invitationController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware("submission.view"),
  invitationController.getById
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("submission.update"),
  invitationController.update
);

router.patch(
  "/:id/review",
  authMiddleware,
  permissionMiddleware("submission.review"),
  invitationController.review
);

router.patch(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware("submission.approve"),
  invitationController.approve
);

router.patch(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware("submission.reject"),
  invitationController.reject
);

module.exports = router;