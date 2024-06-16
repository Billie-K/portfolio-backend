const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('cv'), cvController.uploadCV);
router.get('/', authMiddleware, cvController.getCV);

module.exports = router;