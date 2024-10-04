const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

router.post('/parse', whatsappController.parse);

module.exports = router;
