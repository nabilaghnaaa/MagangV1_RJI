const app = require("./app");
const sequelize = require("./config/database");
const config = require("./config/environment");

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Database berhasil terhubung");

    app.listen(config.port, () => {
      console.log(
        `🚀 Server berjalan di http://localhost:${config.port}`
      );
    });
  } catch (error) {
    console.error("❌ Gagal terhubung ke database");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();