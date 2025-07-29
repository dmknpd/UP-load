import Api from "./api";

import { UpdateFileData } from "../types/files";

//public
export const getPublicFileList = () => Api.get("/files/public");
export const getPublicFileById = (fileId: string) =>
  Api.get(`/files/public/${fileId}`);
export const downloadPublicFile = (fileId: string) =>
  Api.get(`/files/public/download/${fileId}`, {
    responseType: "blob",
  });

//private
export const uploadFile = (data: FormData) =>
  Api.post("/files/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserFileList = () => Api.get("/files/user");

export const getFileById = (fileId: string) => Api.get(`files/${fileId}`);

export const updateFileById = (fileId: string, updatedFile: UpdateFileData) =>
  Api.patch(`/files/update/${fileId}`, updatedFile);

export const downloadFile = (fileId: string) =>
  Api.get(`/files/download/${fileId}`, {
    responseType: "blob",
  });

export const deleteFileById = (fileId: string) =>
  Api.delete(`files/delete/${fileId}`);
