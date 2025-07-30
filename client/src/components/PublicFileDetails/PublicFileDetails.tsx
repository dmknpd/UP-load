import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { File } from "../../types/files";
import { useFileStore } from "../../store/useFileStore";

import fileImg from "../../assets/img/file.svg";

const PublicFileDetails = () => {
  const { fileId } = useParams<{ fileId: string }>();

  const fetchImage = useFileStore((state) => state.fetchImage);
  const downloadFileAction = useFileStore((state) => state.downloadFileAction);

  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>(fileImg);

  const fetchFile = useFileStore((state) => state.fetchFile);

  const isLoading = useFileStore((state) => state.isLoading);
  const setIsLoading = useFileStore((state) => state.setIsLoading);

  const getFile = async () => {
    if (!fileId) return;

    const response = await fetchFile(fileId, true);
    setFile(response);
  };

  const getImg = async () => {
    if (!file) return;

    const url = await fetchImage(file, true);
    setImgUrl(url);
  };

  const handleDownloadFile = async () => {
    if (!file) return;

    downloadFileAction(file, true);
  };

  useEffect(() => {
    if (fileId) {
      setIsLoading(true);
      getFile();
      setIsLoading(false);
    }

    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [fileId]);

  useEffect(() => {
    if (file) {
      getImg();
    }

    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [file]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-2xl text-red-500">File not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-md bg-white">
      <FileInfo
        imgUrl={imgUrl}
        file={file}
        handleDownloadFile={handleDownloadFile}
      />
    </div>
  );
};

interface FileInfoProps {
  imgUrl: string;
  file: File;
  handleDownloadFile: () => void;
}

const FileInfo: React.FC<FileInfoProps> = ({
  imgUrl,
  file,
  handleDownloadFile,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 h-64 flex items-center justify-center border rounded overflow-hidden bg-gray-100">
        <img
          src={imgUrl}
          alt={file.originalname}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <h2 className="text-2xl font-semibold break-words text-center">
        {file.originalname}
      </h2>

      <div className="w-full space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Type:</span> {file.mimetype}
        </p>
        <p>
          <span className="font-semibold">Size: </span>
          {(file.size / 1024).toFixed(2)} KB
        </p>
        <p>
          <span className="font-semibold">Uploaded: </span>
          {new Date(file.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Private: </span>
          {!file.isPublic ? "Yes" : "No"}
        </p>
        <p>
          <span className="font-semibold">Downloads: </span>
          {file.downloads}
        </p>
      </div>

      <button
        onClick={handleDownloadFile}
        className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
      >
        Download
      </button>
    </div>
  );
};

export default PublicFileDetails;
