const express = require('express');
const listController = require('../controllers/listController');
const router = express.Router();

router.get('/:listId', listController.getListById);
router.post('/', listController.createList);
router.get('/lists/:boardId', listController.getAllListByBoard);
router.delete('/:listId', listController.deleteList);
router.put('/:listId', listController.editList);

module.exports = router;