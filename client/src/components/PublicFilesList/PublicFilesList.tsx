import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useFileStore } from "../../store/useFileStore";

import { File } from "../../types/files";

import FilesListItem from "../FileListItem/FileListItem";

const PublicFilesList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fetchFileList = useFileStore((state) => state.fetchFileList);

  const isLoading = useFileStore((state) => state.isLoading);
  const setIsLoading = useFileStore((state) => state.setIsLoading);

  const getFiles = async () => {
    const response = await fetchFileList(true);
    setFiles(response);
    console.log("Files uploaded successfully");
    setIsLoading(false);
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
    <>
      <h1 className="text-lg sm:text-xl font-semibold mb-2 ">Public Files</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {files.map((file) => (
          <li key={file._id}>
            <Link to={`/${file._id}`}>
              <FilesListItem file={file} isPublic={true} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PublicFilesList;
