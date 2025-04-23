const express = require('express');
const cardController = require('../controllers/cardController');
const router = express.Router();

router.get('/:cardId', cardController.getCardById);
router.post('/', cardController.createCard);
router.get('/cards/:listId', cardController.getAllCardByList);
router.delete('/:cardId', cardController.deleteCard);
router.patch('/:cardId/assign', cardController.assignUser);
router.put('/:cardId', cardController.editCard);

module.exports = router;