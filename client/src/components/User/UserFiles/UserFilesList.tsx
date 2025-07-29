import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getUserFilesDetails } from "../../../api/apiFiles";

import { File } from "../../../types/files";

import FilesListItem from "../../FileListItem/FileListItem";

const UserFilesList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserFiles = async () => {
    try {
      const response = await getUserFilesDetails();
      setFiles(response.data.files);
      console.log("Files uploaded successfully");
    } catch (error: any) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserFiles();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-2xl">
          You don’t have any files yet.
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {files.map((file) => (
        <li key={file._id}>
          <Link to={`/${file._id}`}>
            <FilesListItem file={file} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default UserFilesList;
