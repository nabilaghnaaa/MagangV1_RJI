const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attachment = sequelize.define(
  "Attachment",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    assignment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    stored_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    file_path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    file_size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    attachment_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "request_letter",
    },
  },
  {
    tableName: "attachments",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Attachment;