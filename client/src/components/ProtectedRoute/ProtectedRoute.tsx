import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.accessToken);
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
