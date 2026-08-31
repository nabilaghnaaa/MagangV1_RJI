const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Verification = sequelize.define(
  "Verification",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    surat_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },

    verification_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "active",
        "revoked"
      ),
      allowNull: false,
      defaultValue: "active",
    },

    verified_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    last_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    qr_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    qr_generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "verifications",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Verification;