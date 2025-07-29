import Api from "./api";

import { UpdateFileData } from "../types/files";

//public
export const getFilesDetails = () => Api.get("/files/public");
export const downloadPublicFile = (id: string) =>
  Api.get(`/files/public/download/${id}`, {
    responseType: "blob",
  });

//private
export const uploadFile = (data: FormData) =>
  Api.post("/files/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserFilesDetails = () => Api.get("/files/user");

export const updateFileDetails = (id: string, updatedFile: UpdateFileData) =>
  Api.patch(`/files/update/${id}`, updatedFile);

export const downloadFile = (id: string) =>
  Api.get(`/files/download/${id}`, {
    responseType: "blob",
  });

export const getFileDetails = (fileId: string) => Api.get(`files/${fileId}`);

export const deleteFileById = (fileId: string) =>
  Api.delete(`files/delete/${fileId}`);
