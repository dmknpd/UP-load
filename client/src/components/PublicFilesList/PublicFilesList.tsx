import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getFileList } from "../../api/apiFiles";
import { useAuthStore } from "../../store/useAuthStore";
import { useFileStore } from "../../store/useFileStore";

import { File } from "../../types/files";

import FilesListItem from "../FileListItem/FileListItem";

const PublicFilesList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { isLoading, setIsLoading } = useFileStore();
  const token = useAuthStore((state) => state.accessToken);
  const setIsAuthOpen = useAuthStore((state) => state.setIsAuthOpen);

  const getFiles = async () => {
    try {
      const response = await getFileList();
      setFiles(response.data.files);
      console.log("Files uploaded successfully");
    } catch (error: any) {
      console.error("Error fetching files", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  if (isLoading) {
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
          There aren’t any public files yet.
        </div>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {files.map((file) => (
        <li
          key={file._id}
          onClick={() => setIsAuthOpen(true)}
          className="cursor-pointer"
        >
          <FilesListItem file={file} isPublic={true} />
        </li>
      ))}
    </ul>
  );
};

export default PublicFilesList;
