const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");

/*
|--------------------------------------------------------------------------
| User ↔ Role
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
| Role ↔ Permission
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
| RolePermission ↔ Role
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

/*
|--------------------------------------------------------------------------
| RolePermission ↔ Permission
|--------------------------------------------------------------------------
*/

RolePermission.belongsTo(Permission, {
  foreignKey: "permission_id",
  as: "permission",
});

Permission.hasMany(RolePermission, {
  foreignKey: "permission_id",
  as: "rolePermissions",
});

module.exports = {
  User,
  Role,
  Permission,
  RolePermission,
};