const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SuratAssignment = sequelize.define(
  "SuratAssignment",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "review",
        "approved",
        "rejected"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    member_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    member_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    member_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    member_organization: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    member_role: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    activity_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    activity_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    activity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    activity_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    activity_time: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    assignment_subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    request_letter_number: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    request_letter_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reviewed_by: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    rejected_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "surat_assignments",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SuratAssignment;