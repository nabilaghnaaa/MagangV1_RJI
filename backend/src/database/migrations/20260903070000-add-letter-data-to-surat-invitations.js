"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table =
      await queryInterface.describeTable(
        "surat_invitations"
      );

    if (!table.recipient_name) {
      await queryInterface.addColumn(
        "surat_invitations",
        "recipient_name",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.recipient_position) {
      await queryInterface.addColumn(
        "surat_invitations",
        "recipient_position",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.recipient_organization) {
      await queryInterface.addColumn(
        "surat_invitations",
        "recipient_organization",
        {
          type: Sequelize.STRING(200),
          allowNull: true,
        }
      );
    }

    if (!table.activity_address) {
      await queryInterface.addColumn(
        "surat_invitations",
        "activity_address",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        }
      );
    }

    if (!table.letter_number) {
      await queryInterface.addColumn(
        "surat_invitations",
        "letter_number",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.letter_date) {
      await queryInterface.addColumn(
        "surat_invitations",
        "letter_date",
        {
          type: Sequelize.DATEONLY,
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const table =
      await queryInterface.describeTable(
        "surat_invitations"
      );

    if (table.letter_date) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "letter_date"
      );
    }

    if (table.letter_number) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "letter_number"
      );
    }

    if (table.activity_address) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "activity_address"
      );
    }

    if (
      table.recipient_organization
    ) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "recipient_organization"
      );
    }

    if (table.recipient_position) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "recipient_position"
      );
    }

    if (table.recipient_name) {
      await queryInterface.removeColumn(
        "surat_invitations",
        "recipient_name"
      );
    }
  },
};