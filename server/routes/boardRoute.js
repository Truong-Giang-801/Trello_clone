import express from 'express';
import boardController from '../controllers/BoardController.js';  // Using import

const router = express.Router();

router.post('/', boardController.createBoard);
router.get('/', boardController.getAllBoardPublic);
router.get('/:workspaceId', boardController.getAllBoardByWorkspace);
router.delete('/:boardId', boardController.deleteBoard);

export default router;
