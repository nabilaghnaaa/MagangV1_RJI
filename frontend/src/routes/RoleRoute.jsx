import { Navigate, Outlet } from "react-router-dom";
import usePermission from "../hooks/usePermission";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { role } = usePermission();

  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;