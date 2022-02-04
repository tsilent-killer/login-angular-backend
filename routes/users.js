const express = require("express")
const router = express.Router()
const users = require('../controllers/users')


router.post('/register', users.register);
router.post('/login', users.login);
router.get(`/profile/:id`, users.viewProfile);
router.put(`/profile/:id/edit`, users.editProfile);
router.delete(`/profile/:id`, users.deleteProfile);


const multer = require("multer");

const DIR = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    console.log(fileName);
    cb(null, "abc" + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(`/profile/upload/:id`, upload.single("image"), users.uploadImage);

module.exports = router;