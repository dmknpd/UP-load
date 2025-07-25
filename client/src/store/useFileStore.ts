import { create } from "zustand";
import { downloadFile } from "../api/apiFiles";
import fileImg from "../assets/img/file.svg";
import { File } from "../types/files";

interface FileStore {
  fetchImage: (file: File) => Promise<string>;
  downloadFileAction: (file: File) => Promise<void>;
}

export const useFileStore = create<FileStore>(() => ({
  fetchImage: async (file: File) => {
    if (!file.mimetype.startsWith("image/")) {
      return fileImg;
    }

    try {
      const response = await downloadFile(file._id);
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image", error);
      return fileImg;
    }
  },

  downloadFileAction: async (file: File) => {
    try {
      const response = await downloadFile(file._id);

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.originalname;

      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading file", error);
    }
  },
}));
