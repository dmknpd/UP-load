import Api from "./api";

import { UpdateFileData } from "../types/files";

export const uploadFile = (data: FormData) =>
  Api.post("/files/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserFiles = () => Api.get("/files/");
export const updateFileDetails = (id: string, updatedFile: UpdateFileData) =>
  Api.patch(`/files/update/${id}`, updatedFile);

export const downloadFile = (id: string) =>
  Api.get(`/files/download/${id}`, {
    responseType: "blob",
  });

export const getFileDetails = (fileId: string) => Api.get(`files/${fileId}`);

export const deleteFileById = (fileId: string) =>
  Api.delete(`files/delete/${fileId}`);
