import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { File } from "../../../types/files";
import fileImg from "../../../assets/img/file.svg";
import { downloadFile, getFileDetails } from "../../../api/apiFIles";

const UserFileDetails = () => {
  const { fileId } = useParams<{ fileId: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>(fileImg);
  const [loading, setLoading] = useState(true);

  const getFile = async () => {
    if (!fileId) return;
    try {
      const response = await getFileDetails(fileId);
      setFile(response.data.file);
    } catch (error) {
      console.error("Error fetching file", error);
    } finally {
      setLoading(false);
    }
  };

  const getImg = async () => {
    if (!file) return;

    if (file.mimetype.startsWith("image/")) {
      try {
        const response = await downloadFile(file.filename);
        const imageUrl = URL.createObjectURL(response.data);
        setImgUrl(imageUrl);
      } catch (error: any) {
        console.error("Error fetching file img", error);
        setImgUrl(fileImg);
      } finally {
        setLoading(false);
      }
    } else {
      setImgUrl(fileImg);
    }
  };

  const handleDownloadFile = async () => {
    if (!file) return;
    try {
      const response = await downloadFile(file.filename);

      const url = URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalname;
      document.body.appendChild(link);
      link.click();

      link.remove();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading file", error);
    }
  };

  useEffect(() => {
    if (fileId) {
      getFile();
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
      setLoading(false);
    }
  }, [file]);

  if (loading) {
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
            <span className="font-semibold">Public: </span>
            {file.isPublic ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Uploaded: </span>
            {new Date(file.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleDownloadFile}
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default UserFileDetails;
