"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("surat_assignments", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "review",
          "approved",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      member_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      member_email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      member_phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      member_organization: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      member_role: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      activity_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      activity_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      activity_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      activity_end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      activity_time: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      assignment_subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      request_letter_number: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      request_letter_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      admin_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      reviewed_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      rejected_at: {
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("surat_assignments");
  },
};