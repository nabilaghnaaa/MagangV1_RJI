const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrganizationSetting = sequelize.define(
  "OrganizationSetting",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    organization_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    organization_short_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    logo_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    letterhead_top_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    letterhead_bottom_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    updated_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "organization_settings",
    timestamps: true,
    underscored: true,
  }
);

module.exports = OrganizationSetting;