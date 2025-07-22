import { useState, useEffect } from "react";

import { getFile } from "../../../api/apiFIles";

import { File } from "../../../types/files";

import fileImg from "../../../assets/img/file.svg";

interface Props {
  file: File;
}

const UserFilesListItem: React.FC<Props> = ({ file }) => {
  const [imgUrl, setImgUrl] = useState<string>("");

  const getImg = async () => {
    if (file.mimetype.startsWith("image/")) {
      try {
        const response = await getFile(file.filename);
        const imageUrl = URL.createObjectURL(response.data);
        setImgUrl(imageUrl);
      } catch (error: any) {
        console.error("Error fetching files", error);
      }
    } else {
      setImgUrl(fileImg);
    }
  };

  useEffect(() => {
    getImg();
  }, []);

  return (
    <div className="border-2 rounded-lg overflow-hidden shadow-sm p-4 flex flex-col items-center justify-between gap-2">
      <div className="flex items-center h-full">
        {imgUrl ? (
          <img src={imgUrl} alt="File" />
        ) : (
          <div className="spinner spinner-small"></div>
        )}
      </div>
      <p
        className="text-sm text-gray-700 break-words text-center"
        title={file.originalname}
      >
        {file.originalname.length > 20
          ? `${file.originalname.slice(0, 17)}...`
          : file.originalname}
      </p>
    </div>
  );
};

export default UserFilesListItem;
