"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const organizationTable =
      await queryInterface.describeTable(
        "organization_settings"
      );

    if (!organizationTable.letterhead_top_path) {
      await queryInterface.addColumn(
        "organization_settings",
        "letterhead_top_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }

    if (!organizationTable.letterhead_bottom_path) {
      await queryInterface.addColumn(
        "organization_settings",
        "letterhead_bottom_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }

    const suratTable =
      await queryInterface.describeTable(
        "surats"
      );

    if (!suratTable.letterhead_top_path) {
      await queryInterface.addColumn(
        "surats",
        "letterhead_top_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }

    if (!suratTable.letterhead_bottom_path) {
      await queryInterface.addColumn(
        "surats",
        "letterhead_bottom_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const suratTable =
      await queryInterface.describeTable(
        "surats"
      );

    if (suratTable.letterhead_bottom_path) {
      await queryInterface.removeColumn(
        "surats",
        "letterhead_bottom_path"
      );
    }

    if (suratTable.letterhead_top_path) {
      await queryInterface.removeColumn(
        "surats",
        "letterhead_top_path"
      );
    }

    const organizationTable =
      await queryInterface.describeTable(
        "organization_settings"
      );

    if (organizationTable.letterhead_bottom_path) {
      await queryInterface.removeColumn(
        "organization_settings",
        "letterhead_bottom_path"
      );
    }

    if (organizationTable.letterhead_top_path) {
      await queryInterface.removeColumn(
        "organization_settings",
        "letterhead_top_path"
      );
    }
  },
};