import multer from 'multer';
import path from 'path';
import { Request } from 'express';


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
  
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  }
});

export default upload;