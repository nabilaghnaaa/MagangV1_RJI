"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          name: "signature.view",
          description: "Melihat konfigurasi tanda tangan.",
          created_at: now,
          updated_at: now
        },
        {
          name: "signature.update",
          description: "Mengubah konfigurasi tanda tangan.",
          created_at: now,
          updated_at: now
        }
      ]
    );

    const [roles] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM roles
        WHERE name = 'admin'
        LIMIT 1
      `);

    if (!roles.length) {
      throw new Error(
        "Role admin tidak ditemukan."
      );
    }

    const [permissions] =
      await queryInterface.sequelize.query(`
        SELECT id, name
        FROM permissions
        WHERE name IN (
          'signature.view',
          'signature.update'
        )
      `);

    await queryInterface.bulkInsert(
      "role_permissions",
      permissions.map(
        (permission) => ({
          role_id: roles[0].id,
          permission_id:
            permission.id,
          created_at: now,
          updated_at: now
        })
      )
    );
  },

  async down(queryInterface) {
    const [
      permissions
    ] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM permissions
        WHERE name IN (
          'signature.view',
          'signature.update'
        )
      `);

    if (permissions.length) {
      await queryInterface.bulkDelete(
        "role_permissions",
        {
          permission_id:
            permissions.map(
              (permission) =>
                permission.id
            )
        }
      );
    }

    await queryInterface.bulkDelete(
      "permissions",
      {
        name: [
          "signature.view",
          "signature.update"
        ]
      }
    );
  }
};