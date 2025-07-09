import dotenv from "dotenv";
dotenv.config();

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT || 5000;
export const FRONTEND_HOST = process.env.FRONTEND_HOST;
export const FRONTEND_PORT = process.env.FRONTEND_PORT;
export const NODE_ENV = process.env.NODE_ENV;
