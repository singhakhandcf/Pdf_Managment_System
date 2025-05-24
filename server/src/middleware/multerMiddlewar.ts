import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFolder = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (_req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const pdfFilter = function (_req: any, file: any, cb: any) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

export const upload = multer({ storage, fileFilter: pdfFilter });
