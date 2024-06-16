const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, portfolioController.createPortfolio);
router.get('/', authMiddleware, portfolioController.getPortfolio);

module.exports = router;