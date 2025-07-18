import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { refreshToken } from "./api/apiAuth";

import { useAuthStore } from "./store/useAuthStore";
import Header from "./components/Header/Header";
import Upload from "./components/Upload/Upload";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const token = useAuthStore((state) => state.accessToken);
  const email = useAuthStore((state) => state.email);
  const setToken = useAuthStore((state) => state.setToken);

  const handleTokenRefresh = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
    } catch (error: any) {
      console.error("Error", error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      handleTokenRefresh();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Header />
      <main className="py-20 px-4 h-screen container mx-auto">
        <Routes>
          <Route path="/" element={<div>{email ? email : "NONE"}</div>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
