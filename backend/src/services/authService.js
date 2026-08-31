const bcrypt = require("bcryptjs");

const {
  User,
  Role,
  Permission,
} = require("../models");

const {
  generateToken,
} = require("../utils/token");

const login = async (email, password) => {
  const user = await User.findOne({
    where: {
      email,
      is_active: true,
    },

    include: [
      {
        model: Role,
        as: "role",

        include: [
          {
            model: Permission,
            as: "permissions",

            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });

  if (!user) {
    throw new Error("Email atau password salah.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Email atau password salah.");
  }

  await user.update({
    last_login_at: new Date(),
  });

  const permissions =
    user.role?.permissions?.map(
      (permission) => permission.name
    ) || [];

  const token = generateToken({
    userId: user.id,
    roleId: user.role_id,
  });

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,

      role: {
        id: user.role.id,
        name: user.role.name,
      },

      permissions,
    },
  };
};

module.exports = {
  login,
};