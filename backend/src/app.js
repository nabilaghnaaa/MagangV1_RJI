const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorMiddleware = require(
  "./middlewares/errorMiddleware"
);

const app = express();

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Sistem Persuratan RJI berjalan",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;