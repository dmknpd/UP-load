import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes";

import { PORT, MONGO_URI } from "./config/config";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
  })
);

app.use("/api", [authRoutes]);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
