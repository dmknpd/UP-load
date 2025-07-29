import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";
import { useFileStore } from "../../store/useFileStore";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.accessToken);
  const { isLoading } = useFileStore();

  if (isLoading) return null;

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
