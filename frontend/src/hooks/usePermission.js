import useAuthStore from "../store/authStore";

const usePermission = () => {
  const user = useAuthStore((state) => state.user);

  const permissions = user?.permissions || [];
  const role = user?.role?.name || null;

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList = []) => {
    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissionList = []) => {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  const hasRole = (roleName) => {
    return role === roleName;
  };

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
};

export default usePermission;