"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(`
      SELECT id
      FROM roles
      WHERE name = 'admin'
      LIMIT 1
    `);

    if (!roles.length) {
      throw new Error("Role admin belum tersedia.");
    }

    const hashedPassword = await bcrypt.hash(
      "AdminRJI2026!",
      12
    );

    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        role_id: roles[0].id,
        name: "Admin RJI",
        email: "admin@rji.id",
        password: hashedPassword,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: "admin@rji.id",
    });
  },
};