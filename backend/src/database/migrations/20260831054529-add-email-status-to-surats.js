"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("surats");

    if (!table.email_status) {
      await queryInterface.addColumn(
        "surats",
        "email_status",
        {
          type: Sequelize.ENUM(
            "pending",
            "sent",
            "failed"
          ),
          allowNull: false,
          defaultValue: "pending",
        }
      );
    }

    if (!table.email_sent_at) {
      await queryInterface.addColumn(
        "surats",
        "email_sent_at",
        {
          type: Sequelize.DATE,
          allowNull: true,
        }
      );
    }

    if (!table.email_error) {
      await queryInterface.addColumn(
        "surats",
        "email_error",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("surats");

    if (table.email_error) {
      await queryInterface.removeColumn(
        "surats",
        "email_error"
      );
    }

    if (table.email_sent_at) {
      await queryInterface.removeColumn(
        "surats",
        "email_sent_at"
      );
    }

    if (table.email_status) {
      await queryInterface.removeColumn(
        "surats",
        "email_status"
      );
    }
  },
};