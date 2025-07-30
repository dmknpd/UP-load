export interface File {
  _id: string;
  user: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  downloads: number;
  createdAt: Date;
}

export interface UpdateFileData {
  originalname: string;
  isPublic: boolean;
}
