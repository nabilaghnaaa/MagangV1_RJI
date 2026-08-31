"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "verifications",
      "qr_path",
      {
        type: Sequelize.STRING(500),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "verifications",
      "qr_generated_at",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "verifications",
      "qr_generated_at"
    );

    await queryInterface.removeColumn(
      "verifications",
      "qr_path"
    );
  },
};