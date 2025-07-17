import Api from "./api";

export const uploadFile = (data: FormData) =>
  Api.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
