import { File } from "../../../types/files";

interface Props {
  file: File;
}

const UserFilesListItem: React.FC<Props> = ({ file }) => {
  return (
    <div className="border-2 rounded-lg overflow-hidden shadow-sm p-4 flex flex-col items-center justify-between gap-2">
      <img
        src={`http://localhost:5000${file.path}`}
        alt={file.filename}
        className="max-h-40 object-contain"
      />
      <p
        className="text-sm text-gray-700 break-words text-center"
        title={file.filename}
      >
        {file.filename.length > 20
          ? `${file.filename.slice(0, 17)}...`
          : file.filename}
      </p>
    </div>
  );
};

export default UserFilesListItem;
