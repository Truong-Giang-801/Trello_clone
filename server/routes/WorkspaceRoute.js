const express = require('express');
const workspaceController = require('../controllers/workspaceController');
const router = express.Router();

router.post('/', workspaceController.createWorkspace);
router.get('/:userId', workspaceController.getAllWorkspaceByUser);
// router.get('/:userId', workspaceController.getAllBoardByUser);
// router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;