import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { File } from "../../types/files";
import fileImg from "../../assets/img/file.svg";
import { downloadFile, getFileDetails } from "../../api/apiFIles";

import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DeleteIcon from "@mui/icons-material/Delete";

const FileDetails = () => {
  const { fileId } = useParams<{ fileId: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>(fileImg);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);

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

  const onSave = (updatedFile: File) => {
    setFile(updatedFile);
    setEditMode(false);
    // здесь можешь ещё вызвать API-запрос для обновления на сервере
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
      <div className="flex items-center justify-end gap-4 pt-2 relative">
        {editMode ? (
          <KeyboardBackspaceIcon
            className="cursor-pointer text-gray-600 hover:text-black transition absolute left-0"
            onClick={() => setEditMode(false)}
            titleAccess="Back"
          />
        ) : (
          <EditIcon
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition absolute right-10"
            onClick={() => setEditMode(true)}
            titleAccess="Edit"
          />
        )}

        <DeleteIcon
          className="cursor-pointer text-red-500 hover:text-red-700 transition absolute right-0"
          // onClick={handleDeleteFile}
          titleAccess="Delete"
        />
      </div>
      {editMode ? (
        <EditFile imgUrl={imgUrl} file={file} onSave={onSave} />
      ) : (
        <FileInfo
          imgUrl={imgUrl}
          file={file}
          handleDownloadFile={handleDownloadFile}
        />
      )}
    </div>
  );
};

interface EditFileProps {
  imgUrl: string;
  file: File;
  onSave: (updatedFile: File) => void;
}

const EditFile: React.FC<EditFileProps> = ({ imgUrl, file, onSave }) => {
  const [name, setName] = useState(file.originalname);
  const [isPublic, setIsPublic] = useState(file.isPublic);

  const handleSubmit = () => {
    onSave({ ...file, originalname: name, isPublic });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-64 h-64 flex items-center justify-center border rounded overflow-hidden bg-gray-100">
        <img
          src={imgUrl}
          alt={file.originalname}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2  text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        placeholder="Enter file name"
      />

      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-gray-700 ${
            !isPublic ? "font-semibold underline" : ""
          }`}
        >
          Private
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
        <span
          className={`text-gray-700 ${
            isPublic ? "font-semibold underline" : ""
          }`}
        >
          Public
        </span>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
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

export default FileDetails;
