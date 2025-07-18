import Api from "./api";

import { LoginData, RegisterData } from "../types/auth";

export const loginUser = (data: LoginData) => Api.post("/auth/login", data);
export const registerUser = (data: RegisterData) =>
  Api.post("/auth/register", data);
export const refreshToken = () => Api.get("/auth/refresh");
export const logoutUser = () => Api.get("/auth/logout");
