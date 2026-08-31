const express = require("express");

const templateController = require(
  "../controllers/templateController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const permissionMiddleware = require(
  "../middlewares/permissionMiddleware"
);

const router = express.Router();

router.use(authMiddleware);

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  permissionMiddleware("template.view"),
  templateController.getAll
);

router.get(
  "/:id",
  permissionMiddleware("template.view"),
  templateController.getById
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  permissionMiddleware("template.create"),
  templateController.create
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  permissionMiddleware("template.update"),
  templateController.update
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  permissionMiddleware("template.delete"),
  templateController.remove
);

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/activate",
  permissionMiddleware("template.update"),
  templateController.activate
);

router.patch(
  "/:id/deactivate",
  permissionMiddleware("template.update"),
  templateController.deactivate
);

module.exports = router;