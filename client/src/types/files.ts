export interface File {
  _id: string;
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  isPublic: boolean;
  createdAt: Date;
}
