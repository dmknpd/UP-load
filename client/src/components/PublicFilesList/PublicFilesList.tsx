import { useState, useEffect } from "react";

import { getFilesDetails } from "../../api/apiFiles";

import { File } from "../../types/files";

import FilesListItem from "../FileListItem/FileListItem";

const PublicFilesList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const getFiles = async () => {
    try {
      const response = await getFilesDetails();
      setFiles(response.data.files);
      console.log("Files uploaded successfully");
    } catch (error: any) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
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
          There aren’t any public files yet.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
      {files.map((file) => (
        <FilesListItem key={file._id} file={file} />
      ))}
    </div>
  );
};

export default PublicFilesList;
