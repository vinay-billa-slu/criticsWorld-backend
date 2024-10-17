const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storageEngine = multer.diskStorage({
  // destination: "./public/images/",
  destination: function (req, file, cb) {
    try {
      const bpath = "./public/images";
      if (!fs.existsSync(bpath)) {
        fs.mkdirSync(bpath, { recursive: true });
      }
      cb(null, bpath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      cb(null, `${Date.now()}--${file.originalname}`);
      // cb(null, `${file.originalname}`);
    } catch (error) {
      cb(error);
    }
  },
});

const checkFileType = function (file, cb,) {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    const error = new Error("You can Only Upload Images!!")
    cb(error);
  }
};

const Upload = multer({
  storage: storageEngine,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = { Upload };
