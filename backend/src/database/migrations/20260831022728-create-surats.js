"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("surats", {
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

      invitation_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "surat_invitations",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      assignment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,

        references: {
          model: "surat_assignments",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      letter_number: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      letter_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      recipient_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      recipient_email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      pdf_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      pdf_generated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          "draft",
          "issued",
          "sent",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "draft",
      },

      signature_type: {
        type: Sequelize.ENUM(
          "manual",
          "barcode",
          "digital"
        ),
        allowNull: true,
      },

      signature_path: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      signed_at: {
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
      "surats",
      ["invitation_id"]
    );

    await queryInterface.addIndex(
      "surats",
      ["assignment_id"]
    );

    await queryInterface.addIndex(
      "surats",
      ["type"]
    );

    await queryInterface.addIndex(
      "surats",
      ["status"]
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("surats");
  },
};