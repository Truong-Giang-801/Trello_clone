import express from 'express';
import workspaceController from '../controllers/WorkspaceController.js'; // Add .js extension
const router = express.Router();

router.post('/', workspaceController.createWorkspace);
router.get('/:workspaceId', workspaceController.getWorkspace);
router.put('/:workspaceId', workspaceController.updateWorkspace);
router.get('/all/:ownerId', workspaceController.getAllWorkspaceByUser);
// router.get('/:userId', workspaceController.getAllBoardByUser);
// router.delete('/:boardId', boardController.deleteBoard);
router.get('/', workspaceController.getAllWorkspaces);
export default router;