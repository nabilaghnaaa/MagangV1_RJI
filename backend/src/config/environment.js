require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5000),

  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    name: process.env.DB_NAME,
  },

  jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;