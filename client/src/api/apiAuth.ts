import Api from "./api";

import { LoginData, RegisterData } from "../types/auth";

export const loginUser = (data: LoginData) => Api.post("/login", data);
export const registerUser = (data: RegisterData) => Api.post("/register", data);
export const refreshToken = () => Api.get("/refresh");
export const logoutUser = () => Api.get("/logout");
