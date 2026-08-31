const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const path = require("path");

app.use(cors());

app.use(express.json());

app.use(
  "/storage",
  express.static(
    path.resolve(
      __dirname,
      "../storage"
    )
  )
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API Sistem Persuratan RJI berjalan.",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;