require("dotenv").config();

const {
  User,
  Role,
  Permission,
  RolePermission,
} = require("./models");

const testModels = async () => {
  try {
    await Role.findOne();
    await Permission.findOne();
    await RolePermission.findOne();
    await User.findOne();

    console.log("✅ Semua model berhasil dimuat");
  } catch (error) {
    console.error("❌ Model error:");
    console.error(error.message);
  } finally {
    process.exit(0);
  }
};

testModels();