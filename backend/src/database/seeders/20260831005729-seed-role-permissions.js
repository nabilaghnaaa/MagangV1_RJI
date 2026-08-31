"use strict";

module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(`
      SELECT id, name
      FROM roles
      WHERE name = 'admin'
      LIMIT 1
    `);

    if (!roles.length) {
      throw new Error("Role admin belum tersedia.");
    }

    const [permissions] = await queryInterface.sequelize.query(`
      SELECT id
      FROM permissions
    `);

    if (!permissions.length) {
      throw new Error("Permission belum tersedia.");
    }

    const now = new Date();

    const rolePermissions = permissions.map((permission) => ({
      role_id: roles[0].id,
      permission_id: permission.id,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert(
      "role_permissions",
      rolePermissions
    );
  },

  async down(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(`
      SELECT id
      FROM roles
      WHERE name = 'admin'
      LIMIT 1
    `);

    if (!roles.length) {
      return;
    }

    await queryInterface.bulkDelete("role_permissions", {
      role_id: roles[0].id,
    });
  },
};