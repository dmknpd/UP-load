import { useState, useEffect } from "react";

import { getUserFiles } from "../../../api/apiFIles";

import { File } from "../../../types/files";

import UserFilesListItem from "./UserFilesListItem";

const UserFilesList = () => {
  const [files, setFiles] = useState<File[]>([]);

  const getFiles = async () => {
    try {
      const response = await getUserFiles();
      setFiles(response.data.files);
      console.log("Files uploaded successfully");
    } catch (error: any) {
      console.error("Error fetching files", error);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {files.map((file) => (
        <UserFilesListItem key={file._id} file={file} />
      ))}
    </div>
  );
};

export default UserFilesList;
