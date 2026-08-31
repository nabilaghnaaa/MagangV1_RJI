const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SignatureSetting = sequelize.define(
  "SignatureSetting",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },

    mode: {
      type: DataTypes.ENUM(
        "scan",
        "barcode"
      ),
      allowNull: false,
      defaultValue: "scan"
    },

    signer_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Ketua RJI"
    },

    signer_position: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Ketua RJI"
    },

    signature_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    updated_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    }
  },
  {
    tableName: "signature_settings",
    timestamps: true,
    underscored: true
  }
);

module.exports = SignatureSetting;