import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";
import { useFileStore } from "../../store/useFileStore";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.accessToken);

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
