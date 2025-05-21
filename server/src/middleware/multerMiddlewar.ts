// utils/upload.ts (or wherever you're placing this)
import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, path.join(__dirname, "../../public/temp"));
  },
  filename: function (req: Request, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });
