"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [existing] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM permissions
        WHERE name = 'settings.update'
        LIMIT 1
      `);

    if (existing.length) {
      return;
    }

    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          name: "settings.update",
          description: "Mengubah pengaturan sistem.",
          created_at: now,
          updated_at: now,
        },
      ]
    );

    const [roles] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM roles
        WHERE name = 'admin'
        LIMIT 1
      `);

    const [permissions] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM permissions
        WHERE name = 'settings.update'
        LIMIT 1
      `);

    if (roles.length && permissions.length) {
      await queryInterface.bulkInsert(
        "role_permissions",
        [
          {
            role_id: roles[0].id,
            permission_id: permissions[0].id,
            created_at: now,
            updated_at: now,
          },
        ]
      );
    }
  },

  async down(queryInterface) {
    const [permissions] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM permissions
        WHERE name = 'settings.update'
        LIMIT 1
      `);

    if (permissions.length) {
      await queryInterface.bulkDelete(
        "role_permissions",
        {
          permission_id:
            permissions[0].id,
        }
      );

      await queryInterface.bulkDelete(
        "permissions",
        {
          id: permissions[0].id,
        }
      );
    }
  },
};