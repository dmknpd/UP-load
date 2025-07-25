import { useEffect, useState } from "react";

import { uploadFile } from "../../api/apiFiles";

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import fileImg from "../../assets/img/file.svg";

const Upload = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(fileImg);
  const [fileSuccess, setFileSuccess] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleFiles = (files: FileList | null) => {
    setFileSuccess("");
    setFileError("");
    if (!files || files.length === 0) {
      setFile(null);
      setPreviewUrl(fileImg);
      return;
    }

    const file = files?.[0];
    if (file) {
      setFile(file);

      if (previewUrl !== fileImg) {
        URL.revokeObjectURL(previewUrl);
      }

      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(fileImg);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("Select File");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadFile(formData);
      handleFiles(null);
      setFileSuccess(response.data.message);
      console.log("File uploaded successfully");
    } catch (error: any) {
      if (error.response?.data?.errors?.file) {
        setFileError(error.response.data.errors.file.join(", "));
      } else {
        setFileError("Unknown error occurred");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl !== fileImg) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <DriveFolderUploadIcon
        style={{ fontSize: 200, color: "rgb(59,130,246)" }}
      />
      <label
        className={`group border-4 border-dashed w-1/2 mx-auto flex flex-col items-center justify-between p-4 mb-8 cursor-pointer hover:border-blue-400 hover:bg-blue-100/70
          ${dragActive ? "border-blue-500 bg-blue-100/70" : "border-gray-300"}
          `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className="max-h-32 object-contain mb-2"
            />
            <p className="text-blue-500">{file.name}</p>
          </>
        ) : (
          <p
            className={`text-gray-500 group-hover:text-blue-500 ${
              dragActive && "text-blue-500"
            }`}
          >
            Drag and drop file here or click to select
          </p>
        )}

        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>

      {fileSuccess && (
        <div className="text-green-600 font-semibold text-center mb-8">
          {fileSuccess}
        </div>
      )}

      {fileError && <div className="text-red-500 mb-8">{fileError}</div>}

      <button
        onClick={handleUpload}
        disabled={!file}
        className={`border rounded-md px-3 py-2 bg-blue-500  text-white text-2xl ${
          !file ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        Upload
      </button>
    </div>
  );
};

export default Upload;
