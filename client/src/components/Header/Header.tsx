import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/useAuthStore";
import AuthModal from "../AuthModal/AuthModal";
import { logoutUser } from "../../api/apiAuth";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error: any) {
      console.error("Logout error: ", error.message);
    } finally {
      logout();
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white py-2 shadow-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-lg sm:text-xl font-semibold">UP-load</h1>
        </Link>
        <ul className="flex gap-4 sm:gap-6 items-center">
          {isLoading ? (
            <li className="p-4 mr-28">
              <div className="dots"></div>
            </li>
          ) : email ? (
            <>
              <li className="hover:bg-blue-500 p-2 rounded-md text-black cursor-pointer hover:text-white">
                <Link to="/upload">
                  <FileUploadIcon style={{ fontSize: 30 }} />
                </Link>
              </li>
              <li className="hover:bg-blue-500 p-2 rounded-md text-black cursor-pointer hover:text-white ">
                <Link to="/" className="text-[20px]">
                  {email}
                </Link>
              </li>
              <li className="hover:bg-blue-500 p-2 rounded-md  text-black cursor-pointer hover:text-white">
                <LogoutIcon onClick={handleLogout} style={{ fontSize: 30 }} />
              </li>
            </>
          ) : (
            <li
              onClick={() => setIsAuthOpen(true)}
              className="hover:bg-blue-500 p-2 rounded-md text-black cursor-pointer hover:text-white"
            >
              <LoginIcon style={{ fontSize: 30 }} />
            </li>
          )}
        </ul>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Header;
