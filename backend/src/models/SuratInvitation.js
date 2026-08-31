const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SuratInvitation = sequelize.define(
  "SuratInvitation",
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

    participant_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    participant_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    participant_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    organization: {
      type: DataTypes.STRING(150),
      allowNull: true,
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

    invitation_subject: {
      type: DataTypes.STRING(255),
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
    tableName: "surat_invitations",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SuratInvitation;