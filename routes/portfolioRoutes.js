const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
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
    cb(null, 'avatar-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('avatar'), portfolioController.createPortfolio);
router.get('/:slug', portfolioController.getPortfolio);

module.exports = router;