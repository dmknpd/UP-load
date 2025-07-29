import { create } from "zustand";
import {
  downloadFile,
  downloadPublicFile,
  getFileById,
  getPublicFileById,
  getPublicFileList,
  getUserFileList,
} from "../api/apiFiles";

import { File } from "../types/files";
import fileImg from "../assets/img/file.svg";

interface FileStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  fetchImage: (file: File, isPublic?: boolean) => Promise<string>;
  fetchFileList: (isPublic?: boolean) => Promise<File[]>;
  fetchFile: (fileId: string, isPublic?: boolean) => Promise<File>;
  downloadFileAction: (file: File, isPublic?: boolean) => Promise<void>;
}

export const useFileStore = create<FileStore>((set) => ({
  isLoading: true,

  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  fetchImage: async (file: File, isPublic = false) => {
    if (!file.mimetype.startsWith("image/")) {
      return fileImg;
    }

    try {
      const response = isPublic
        ? await downloadPublicFile(file._id)
        : await downloadFile(file._id);

      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image", error);
      return fileImg;
    }
  },

  fetchFileList: async (isPublic = false) => {
    try {
      const response = isPublic
        ? await getPublicFileList()
        : await getUserFileList();

      return response.data.files;
    } catch (error) {
      console.error("Error fetching file list", error);
    }
  },

  fetchFile: async (fileId, isPublic = false) => {
    try {
      const response = isPublic
        ? await getPublicFileById(fileId)
        : await getFileById(fileId);

      return response.data.file;
    } catch (error) {
      console.error("Error fetching file", error);
    }
  },

  downloadFileAction: async (file: File, isPublic = false) => {
    try {
      const response = isPublic
        ? await downloadPublicFile(file._id)
        : await downloadFile(file._id);

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.originalname;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
    }
  },
}));
