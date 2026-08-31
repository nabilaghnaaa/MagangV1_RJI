"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("surats");

    if (!table.signature_mode) {
      await queryInterface.addColumn(
        "surats",
        "signature_mode",
        {
          type: Sequelize.ENUM("scan", "barcode"),
          allowNull: true,
        }
      );
    }

    if (!table.signature_name) {
      await queryInterface.addColumn(
        "surats",
        "signature_name",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.signature_position) {
      await queryInterface.addColumn(
        "surats",
        "signature_position",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.signature_path) {
      await queryInterface.addColumn(
        "surats",
        "signature_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("surats");

    if (table.signature_path) {
      await queryInterface.removeColumn(
        "surats",
        "signature_path"
      );
    }

    if (table.signature_position) {
      await queryInterface.removeColumn(
        "surats",
        "signature_position"
      );
    }

    if (table.signature_name) {
      await queryInterface.removeColumn(
        "surats",
        "signature_name"
      );
    }

    if (table.signature_mode) {
      await queryInterface.removeColumn(
        "surats",
        "signature_mode"
      );
    }

    await queryInterface.sequelize.query(
      "ALTER TABLE surats MODIFY COLUMN signature_mode ENUM('scan','barcode') NULL"
    );
  },
};