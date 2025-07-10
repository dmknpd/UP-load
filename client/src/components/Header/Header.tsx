import { useState } from "react";
import { Link } from "react-router-dom";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoginIcon from "@mui/icons-material/Login";
import AuthModal from "../AuthModal/AuthModal";

const Header = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white py-2 shadow-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-lg sm:text-xl font-semibold">UP-load</h1>
        </Link>
        <ul className="flex gap-4 sm:gap-6 items-center">
          <li className="hover:bg-blue-500 p-2 rounded-md text-black hover:text-white">
            <Link to="/">
              <FileUploadIcon style={{ fontSize: 30 }} />
            </Link>
          </li>
          <li className="hover:bg-blue-500 p-2 rounded-md text-black hover:text-white">
            <LoginIcon
              onClick={() => setIsAuthOpen(true)}
              style={{ fontSize: 30 }}
            />
          </li>
        </ul>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Header;
