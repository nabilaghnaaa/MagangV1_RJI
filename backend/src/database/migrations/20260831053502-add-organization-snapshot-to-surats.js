"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("surats");

    if (!table.organization_name) {
      await queryInterface.addColumn(
        "surats",
        "organization_name",
        {
          type: Sequelize.STRING(200),
          allowNull: true,
        }
      );
    }

    if (!table.organization_short_name) {
      await queryInterface.addColumn(
        "surats",
        "organization_short_name",
        {
          type: Sequelize.STRING(100),
          allowNull: true,
        }
      );
    }

    if (!table.organization_address) {
      await queryInterface.addColumn(
        "surats",
        "organization_address",
        {
          type: Sequelize.TEXT,
          allowNull: true,
        }
      );
    }

    if (!table.organization_email) {
      await queryInterface.addColumn(
        "surats",
        "organization_email",
        {
          type: Sequelize.STRING(150),
          allowNull: true,
        }
      );
    }

    if (!table.organization_phone) {
      await queryInterface.addColumn(
        "surats",
        "organization_phone",
        {
          type: Sequelize.STRING(50),
          allowNull: true,
        }
      );
    }

    if (!table.organization_website) {
      await queryInterface.addColumn(
        "surats",
        "organization_website",
        {
          type: Sequelize.STRING(255),
          allowNull: true,
        }
      );
    }

    if (!table.organization_logo_path) {
      await queryInterface.addColumn(
        "surats",
        "organization_logo_path",
        {
          type: Sequelize.STRING(500),
          allowNull: true,
        }
      );
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("surats");

    if (table.organization_logo_path) {
      await queryInterface.removeColumn(
        "surats",
        "organization_logo_path"
      );
    }

    if (table.organization_website) {
      await queryInterface.removeColumn(
        "surats",
        "organization_website"
      );
    }

    if (table.organization_phone) {
      await queryInterface.removeColumn(
        "surats",
        "organization_phone"
      );
    }

    if (table.organization_email) {
      await queryInterface.removeColumn(
        "surats",
        "organization_email"
      );
    }

    if (table.organization_address) {
      await queryInterface.removeColumn(
        "surats",
        "organization_address"
      );
    }

    if (table.organization_short_name) {
      await queryInterface.removeColumn(
        "surats",
        "organization_short_name"
      );
    }

    if (table.organization_name) {
      await queryInterface.removeColumn(
        "surats",
        "organization_name"
      );
    }
  },
};