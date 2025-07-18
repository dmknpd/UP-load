import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./routes/auth.routes";
import fileRoutes from "./routes/file.routes";

import { PORT, MONGO_URI } from "./config/config";
import { multerErrorHandler } from "./middleware/multer.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(
  cors({
    origin: `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.use(multerErrorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
