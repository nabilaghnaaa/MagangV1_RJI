"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable(
      "surat_invitations"
    );

    if (!table.signer_name) {
      await queryInterface.addColumn(
        "surat_invitations",
        "signer_name",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        }
      );
    }

    if (!table.signer_position) {
      await queryInterface.addColumn(
        "surat_invitations",
        "signer_position",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    await queryInterface.sequelize.query(`
      UPDATE surat_invitations
      SET
        signer_name = 'Dr. Arbain, Sp.Pd., M.Pd.',
        signer_position = 'Ketua RJI'
      WHERE signer_name IS NULL
    `);
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable(
      "surat_invitations"
    );

    if (table.signer_position) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "signer_position"
      );
    }

    if (table.signer_name) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "signer_name"
      );
    }
  },
};