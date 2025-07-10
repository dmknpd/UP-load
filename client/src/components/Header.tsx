import { Link } from "react-router-dom";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonIcon from "@mui/icons-material/Person";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white py-2 shadow-md z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold">UP-load</h1>
        <ul className="flex gap-4 sm:gap-8 items-center">
          <li className="hover:bg-blue-400 p-2 rounded-md text-black hover:text-white">
            <Link to="/">
              <FileUploadIcon style={{ fontSize: 30 }} />
            </Link>
          </li>
          <li className="hover:bg-blue-400 p-2 rounded-md text-black hover:text-white">
            <Link to="/login">
              <PersonIcon style={{ fontSize: 30 }} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
