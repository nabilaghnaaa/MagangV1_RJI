"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          name: "verification.create",
          description:
            "Membuat data verifikasi surat.",
          created_at: now,
          updated_at: now,
        },
        {
          name: "verification.revoke",
          description:
            "Mencabut verifikasi surat.",
          created_at: now,
          updated_at: now,
        },
      ]
    );

    const [adminRole] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM roles
        WHERE name = 'admin'
        LIMIT 1
      `);

    if (!adminRole.length) {
      throw new Error(
        "Role admin tidak ditemukan."
      );
    }

    const [permissions] =
      await queryInterface.sequelize.query(`
        SELECT id, name
        FROM permissions
        WHERE name IN (
          'verification.create',
          'verification.revoke'
        )
      `);

    await queryInterface.bulkInsert(
      "role_permissions",
      permissions.map((permission) => ({
        role_id: adminRole[0].id,
        permission_id: permission.id,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface) {
    const [permissions] =
      await queryInterface.sequelize.query(`
        SELECT id
        FROM permissions
        WHERE name IN (
          'verification.create',
          'verification.revoke'
        )
      `);

    if (permissions.length) {
      await queryInterface.bulkDelete(
        "role_permissions",
        {
          permission_id: permissions.map(
            (permission) =>
              permission.id
          ),
        }
      );
    }

    await queryInterface.bulkDelete(
      "permissions",
      {
        name: [
          "verification.create",
          "verification.revoke",
        ],
      }
    );
  },
};