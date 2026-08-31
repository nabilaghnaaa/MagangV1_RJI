"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("surat_templates", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM(
          "invitation",
          "assignment"
        ),
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      footer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      signature_type: {
        type: Sequelize.ENUM(
          "manual",
          "barcode",
          "digital"
        ),
        allowNull: true,
        defaultValue: "manual",
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      "surat_templates",
      ["type"]
    );

    await queryInterface.addIndex(
      "surat_templates",
      ["is_active"]
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("surat_templates");
  },
};