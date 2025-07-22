import { Schema, model, Document, Types } from "mongoose";

export interface IFile extends Document {
  user: Types.ObjectId;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  createdAt: Date;
}

const FileSchema: Schema<IFile> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default model("File", FileSchema);
