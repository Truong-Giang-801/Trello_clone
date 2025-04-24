import express from 'express';
import cardController from '../controllers/cardController.js';
const router = express.Router();

router.get('/:cardId', cardController.getCardById);
router.post('/', cardController.createCard);
router.get('/cards/:listId', cardController.getAllCardByList);
router.delete('/:cardId', cardController.deleteCard);
router.patch('/:cardId/assign', cardController.assignUser);
router.delete('/cards/:cardId/assign/:userId', cardController.removeAssignedUser);
router.put('/:cardId', cardController.editCard);

export default router;