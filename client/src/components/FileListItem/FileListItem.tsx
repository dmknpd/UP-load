import { useState, useEffect } from "react";

import { useFileStore } from "../../store/useFileStore";

import { File } from "../../types/files";
import fileImg from "../../assets/img/file.svg";

interface Props {
  file: File;
  isPublic?: boolean;
}

const FilesListItem: React.FC<Props> = ({ file, isPublic = false }) => {
  const { fetchImage } = useFileStore();
  const [imgUrl, setImgUrl] = useState<string>(fileImg);

  const getImg = async () => {
    if (!file) return;

    const url = await fetchImage(file, isPublic);
    setImgUrl(url);
  };

  useEffect(() => {
    if (file) {
      getImg();
    }

    return () => {
      URL.revokeObjectURL(imgUrl);
    };
  }, [file]);

  return (
    <div className="border-2 rounded-lg overflow-hidden h-full shadow-sm p-4 flex flex-col items-center justify-between gap-2">
      <div className="flex items-center h-full">
        <img src={imgUrl} alt="File" />
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

export default FilesListItem;
