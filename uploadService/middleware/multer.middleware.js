import multer from "multer";
import path from 'path'
import fs from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(fs.existsSync('../uploads')===true)
    {
      cb(null, "../uploads");
    }else{
      fs.mkdirSync('../uploads')
      cb(null, "../uploads");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix+path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
export default upload;
