import Api from "./api";

export const uploadFile = (data: FormData) =>
  Api.post("/files/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getUserFiles = () => Api.get("/files/");
export const getFile = (filename: string) =>
  Api.get(`/files/download/${filename}`, {
    responseType: "blob",
  });
