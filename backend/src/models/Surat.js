const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Surat = sequelize.define(
  "Surat",
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

    invitation_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    assignment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    letter_number: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    letter_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    recipient_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    recipient_email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    pdf_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    pdf_generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "draft",
        "issued",
        "sent",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "draft",
    },

    email_status: {
      type: DataTypes.ENUM(
        "pending",
        "sent",
        "failed"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    email_sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    email_error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    template_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },

    template_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    template_content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    template_footer: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    signature_type: {
      type: DataTypes.ENUM(
        "manual",
        "barcode",
        "digital"
      ),
      allowNull: true,
    },

    signature_mode: {
      type: DataTypes.ENUM(
        "scan",
        "barcode"
      ),
      allowNull: true,
    },

    signature_name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    signature_position: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    signature_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    organization_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    organization_short_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    organization_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    organization_email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    organization_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    organization_website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    organization_logo_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    signed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "surats",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Surat;