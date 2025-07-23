import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { refreshToken } from "./api/apiAuth";

import { useAuthStore } from "./store/useAuthStore";
import Header from "./components/Header/Header";
import Upload from "./components/Upload/Upload";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserFilesList from "./components/User/UserFiles/UserFilesList";
import UserFileDetails from "./components/User/UserFiles/UserFileDetails";

function App() {
  const token = useAuthStore((state) => state.accessToken);
  const setToken = useAuthStore((state) => state.setToken);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const handleTokenRefresh = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
    } catch (error: any) {
      console.error("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setIsLoading(true);
      handleTokenRefresh();
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Header />
      <main className="py-24 px-4 h-screen container mx-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="spinner"></div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<div>Main</div>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/my-files" element={<UserFilesList />} />
              <Route path="/:fileId" element={<UserFileDetails />} />
            </Route>
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;
