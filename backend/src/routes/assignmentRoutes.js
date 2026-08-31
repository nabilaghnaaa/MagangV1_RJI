const express = require("express");

const assignmentController = require(
  "../controllers/assignmentController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const {
  uploadAssignmentAttachment,
} = require(
  "../middlewares/uploadMiddleware"
);

const {
  turnstileMiddleware,
} = require(
  "../middlewares/turnstileMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Anggota RJI mengajukan Surat Tugas tanpa login.
|--------------------------------------------------------------------------

*/

router.post(
  "/",
  turnstileMiddleware,
  uploadAssignmentAttachment.single(
    "request_letter"
  ),
  assignmentController.create
);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  permissionMiddleware(
    "submission.view"
  ),
  assignmentController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  permissionMiddleware(
    "submission.view"
  ),
  assignmentController.getById
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware(
    "submission.update"
  ),
  assignmentController.update
);

router.patch(
  "/:id/review",
  authMiddleware,
  permissionMiddleware(
    "submission.review"
  ),
  assignmentController.review
);

router.patch(
  "/:id/approve",
  authMiddleware,
  permissionMiddleware(
    "submission.approve"
  ),
  assignmentController.approve
);

router.patch(
  "/:id/reject",
  authMiddleware,
  permissionMiddleware(
    "submission.reject"
  ),
  assignmentController.reject
);

module.exports = router;