"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("verifications", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      surat_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,

        references: {
          model: "surats",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      token: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true,
      },

      verification_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "active",
          "revoked"
        ),
        allowNull: false,
        defaultValue: "active",
      },

      verified_count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      last_verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        ),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex(
      "verifications",
      ["surat_id"]
    );

    await queryInterface.addIndex(
      "verifications",
      ["status"]
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("verifications");
  },
};