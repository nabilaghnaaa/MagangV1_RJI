import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const RoleRoute = ({ allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);

  const roleName = user?.role?.name;

  if (!allowedRoles.includes(roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;