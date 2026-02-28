import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp') //cb :callback, 2nd field of cb is the filename where the files are stored temporarily 
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname) // In which name the file will be stored after upload
  }
})

export const upload = multer({ 
    storage,
 })