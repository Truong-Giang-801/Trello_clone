const express = require('express');
const boardController = require('../controllers/BoardController');
const router = express.Router();

router.post('/', boardController.createBoard);
router.get('/', boardController.getAllBoardPublic);
router.get('/:workspaceId', boardController.getAllBoardByWorkspace);
router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;