const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SuratTemplate = sequelize.define(
  "SuratTemplate",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "invitation",
        "assignment"
      ),
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    footer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    signature_type: {
      type: DataTypes.ENUM(
        "manual",
        "barcode",
        "digital"
      ),
      allowNull: true,
      defaultValue: "manual",
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "surat_templates",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SuratTemplate;