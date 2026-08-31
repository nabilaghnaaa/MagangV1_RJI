"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("surats");

    if (!table.template_id) {
      await queryInterface.addColumn(
        "surats",
        "template_id",
        {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true,
        }
      );
    }

    if (!table.template_name) {
      await queryInterface.addColumn(
        "surats",
        "template_name",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        }
      );
    }

    if (!table.template_content) {
      await queryInterface.addColumn(
        "surats",
        "template_content",
        {
          type: Sequelize.TEXT("long"),
          allowNull: true,
        }
      );
    }

    if (!table.template_footer) {
      await queryInterface.addColumn(
        "surats",
        "template_footer",
        {
          type: Sequelize.TEXT("long"),
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("surats");

    if (table.template_footer) {
      await queryInterface.removeColumn(
        "surats",
        "template_footer"
      );
    }

    if (table.template_content) {
      await queryInterface.removeColumn(
        "surats",
        "template_content"
      );
    }

    if (table.template_name) {
      await queryInterface.removeColumn(
        "surats",
        "template_name"
      );
    }

    if (table.template_id) {
      await queryInterface.removeColumn(
        "surats",
        "template_id"
      );
    }
  },
};