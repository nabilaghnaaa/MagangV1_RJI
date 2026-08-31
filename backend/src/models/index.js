const sequelize = require("../config/database");

const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const SignatureSetting = require("./SignatureSetting");
const OrganizationSetting = require("./OrganizationSetting");

const SuratInvitation = require(
  "./SuratInvitation"
);

const SuratAssignment = require(
  "./SuratAssignment"
);

const Attachment = require(
  "./Attachment"
);

const Surat = require("./Surat");
const SuratTemplate = require(
  "./SuratTemplate"
);

const Verification = require(
  "./Verification"
);

/*
|--------------------------------------------------------------------------
| USER ↔ ROLE
|--------------------------------------------------------------------------
*/

Role.hasMany(User, {
  foreignKey: "role_id",
  as: "users",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

/*
|--------------------------------------------------------------------------
| ROLE ↔ PERMISSION
|--------------------------------------------------------------------------
*/

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});

/*
|--------------------------------------------------------------------------
| ROLE PERMISSION
|--------------------------------------------------------------------------
*/

RolePermission.belongsTo(Role, {
  foreignKey: "role_id",
  as: "role",
});

Role.hasMany(RolePermission, {
  foreignKey: "role_id",
  as: "rolePermissions",
});

RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "rolePermissions",
});

/*
|--------------------------------------------------------------------------
| USER ↔ SURAT INVITATION
|--------------------------------------------------------------------------
*/

User.hasMany(SuratInvitation, {
  foreignKey: "reviewed_by",
  as: "reviewedInvitations",
});

SuratInvitation.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewer",
});

/*
|--------------------------------------------------------------------------
| USER ↔ SURAT ASSIGNMENT
|--------------------------------------------------------------------------
*/

User.hasMany(SuratAssignment, {
  foreignKey: "reviewed_by",
  as: "reviewedAssignments",
});

SuratAssignment.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewer",
});

/*
|--------------------------------------------------------------------------
| SURAT ASSIGNMENT ↔ ATTACHMENT
|--------------------------------------------------------------------------
*/

SuratAssignment.hasMany(Attachment, {
  foreignKey: "assignment_id",
  as: "attachments",
});

Attachment.belongsTo(SuratAssignment, {
  foreignKey: "assignment_id",
  as: "assignment",
});

/*
|--------------------------------------------------------------------------
| SURAT INVITATION ↔ SURAT
|--------------------------------------------------------------------------
*/

SuratInvitation.hasMany(Surat, {
  foreignKey: "invitation_id",
  as: "surats",
});

Surat.belongsTo(SuratInvitation, {
  foreignKey: "invitation_id",
  as: "invitation",
});

/*
|--------------------------------------------------------------------------
| SURAT ASSIGNMENT ↔ SURAT
|--------------------------------------------------------------------------
*/

SuratAssignment.hasMany(Surat, {
  foreignKey: "assignment_id",
  as: "surats",
});

Surat.belongsTo(SuratAssignment, {
  foreignKey: "assignment_id",
  as: "assignment",
});

/*
|--------------------------------------------------------------------------
| USER ↔ SURAT TEMPLATE
|--------------------------------------------------------------------------
*/

User.hasMany(SuratTemplate, {
  foreignKey: "created_by",
  as: "createdTemplates",
});

SuratTemplate.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

/*
|--------------------------------------------------------------------------
| SURAT ↔ VERIFICATION
|--------------------------------------------------------------------------
*/

Surat.hasOne(Verification, {
  foreignKey: "surat_id",
  as: "verification",
});

Verification.belongsTo(Surat, {
  foreignKey: "surat_id",
  as: "surat",
});

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

User.hasMany(SignatureSetting, {
  foreignKey: "updated_by",
  as: "updatedSignatureSettings"
});

SignatureSetting.belongsTo(User, {
  foreignKey: "updated_by",
  as: "updater"
});

User.hasMany(OrganizationSetting, {
  foreignKey: "updated_by",
  as: "updatedOrganizationSettings",
});

OrganizationSetting.belongsTo(User, {
  foreignKey: "updated_by",
  as: "updater",
});


module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  SuratInvitation,
  SuratAssignment,
  Attachment,
  Surat,
  SuratTemplate,
  Verification,
  SignatureSetting,
  OrganizationSetting,
};