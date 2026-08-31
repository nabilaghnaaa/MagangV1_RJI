"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("signature_settings", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      mode: {
        type: Sequelize.ENUM("scan", "barcode"),
        allowNull: false,
        defaultValue: "scan"
      },

      signer_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: "Ketua RJI"
      },

      signer_position: {
        type: Sequelize.STRING(150),
        allowNull: false,
        defaultValue: "Ketua RJI"
      },

      signature_path: {
        type: Sequelize.STRING(500),
        allowNull: true
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "users",
          key: "id"
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
      }
    });

    await queryInterface.addIndex(
      "signature_settings",
      ["is_active"]
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "signature_settings"
    );
  }
};