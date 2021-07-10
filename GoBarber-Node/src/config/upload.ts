import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpPath = path.resolve(__dirname, '..', '..', 'tmp');
const uploadPath = path.resolve(tmpPath, 'uploads');

export default {
  tmpFolder: tmpPath,

  uploadsFolder: uploadPath,

  storage: multer.diskStorage({
    destination: tmpPath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
