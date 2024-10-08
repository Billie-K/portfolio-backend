const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where files should be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique name for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'cv' + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), cvController.uploadCV);
router.get('/', authMiddleware, cvController.getCV);
// router.post('/ml-parse-pdf', upload.single('file'), cvController.mlParsePDF);
router.post('/ml-parse-pdf', upload.single('file'), cvController.gptParsePDF);
router.get('/ml-parse-docx', cvController.mlParseDOCX);

module.exports = router;