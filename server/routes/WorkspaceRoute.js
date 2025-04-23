import express from 'express';
import workspaceController from '../controllers/WorkspaceController.js'; // Add .js extension
const router = express.Router();

router.post('/', workspaceController.createWorkspace);
router.get('/:userId', workspaceController.getAllWorkspaceByUser);
// router.get('/:userId', workspaceController.getAllBoardByUser);
// router.delete('/:boardId', boardController.deleteBoard);

export default router;