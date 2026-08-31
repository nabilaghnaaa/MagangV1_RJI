"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attachments", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      assignment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,

        references: {
          model: "surat_assignments",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      stored_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      file_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },

      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      file_size: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      attachment_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: "request_letter",
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("attachments");
  },
};