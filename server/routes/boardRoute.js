/**
 * @swagger
 * tags:
 *   name: Board
 *   description: API endpoints for managing boards
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Board:
 *       type: object
 *       required:
 *         - userId
 *         - boardId
 *         - title
 *         - workspace
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who created the board
 *           example: 123abc456xyz
 *         boardId:
 *           type: string
 *           description: Unique ID for the board
 *           example: board-789xyz
 *         title:
 *           type: string
 *           description: Title of the board
 *           example: Sprint Planning
 *         workspace:
 *           type: string
 *           description: Workspace the board belongs to
 *           example: workspace-001
 */

/**
 * @swagger
 * /board:
 *   post:
 *     summary: Create a new board
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Board'
 *     responses:
 *       201:
 *         description: Board created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /board:
 *   get:
 *     summary: Get all public boards
 *     tags: [Board]
 *     responses:
 *       200:
 *         description: List of public boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /board/{workspaceId}:
 *   get:
 *     summary: Get all boards in a workspace
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workspace
 *     responses:
 *       200:
 *         description: List of boards in the specified workspace
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /board/{boardId}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Board]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the board to delete
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 */
import express from 'express';
import boardController from '../controllers/BoardController.js';  // Using import

const router = express.Router();

router.post('/', boardController.createBoard);
router.get('/', boardController.getAllBoardPublic);
router.get('/:boardId', boardController.getBoard);
router.get('/all/:workspaceId', boardController.getAllBoardByWorkspace);
router.delete('/:boardId', boardController.deleteBoard);

export default router;
