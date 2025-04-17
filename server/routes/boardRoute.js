const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

router.post('/', boardController.createBoard);

module.exports = router;