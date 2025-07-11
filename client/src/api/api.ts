import axios from "axios";

import { BACKEND_HOST, BACKEND_PORT } from "../config/config";
import { LoginData, RegisterData } from "../types/auth";

const Api = axios.create({
  baseURL: `${BACKEND_HOST}:${BACKEND_PORT}/api`,
});

export const loginUser = (data: LoginData) => Api.post("/login", data);
export const registerUser = (data: RegisterData) => Api.post("/register", data);
