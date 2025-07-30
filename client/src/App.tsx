import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { refreshToken } from "./api/apiAuth";

import { useAuthStore } from "./store/useAuthStore";
import { useFileStore } from "./store/useFileStore";

import Header from "./components/Header/Header";
import Upload from "./components/Upload/Upload";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FileDetails from "./components/User/UserFiles/UserFileDetails/UserFileDetails";
import AuthModal from "./components/AuthModal/AuthModal";
import PublicFilesList from "./components/PublicFilesList/PublicFilesList";
import UserFileList from "./components/User/UserFiles/UserFileList/UserFileList";
import UserFileDetails from "./components/User/UserFiles/UserFileDetails/UserFileDetails";
import PublicFileDetails from "./components/PublicFileDetails/PublicFileDetails";

function App() {
  const token = useAuthStore((state) => state.accessToken);
  const setToken = useAuthStore((state) => state.setToken);
  const isLoading = useFileStore((state) => state.isLoading);
  const setIsLoading = useFileStore((state) => state.setIsLoading);
  const isAuthOpen = useAuthStore((state) => state.isAuthOpen);
  const setIsAuthOpen = useAuthStore((state) => state.setIsAuthOpen);

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
            <Route path="/" element={<PublicFilesList />} />
            <Route path="/:fileId" element={<PublicFileDetails />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/my_files" element={<UserFileList />} />
              <Route path="/my_files/:fileId" element={<UserFileDetails />} />
            </Route>
          </Routes>
        )}
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </main>
    </BrowserRouter>
  );
}

export default App;
