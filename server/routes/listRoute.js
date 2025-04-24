/**
 * @swagger
 * tags:
 *   name: List
 *   description: API endpoints for managing lists
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     List:
 *       type: object
 *       required:
 *         - title
 *         - boardId
 *         - position
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the list
 *           example: To Do
 *         boardId:
 *           type: string
 *           description: ID of the board this list belongs to
 *           example: board-456
 *         position:
 *           type: number
 *           description: Position of the list in the board
 *           example: 1
 */

/**
 * @swagger
 * /list:
 *   post:
 *     summary: Create a new list
 *     tags: [List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/List'
 *     responses:
 *       201:
 *         description: List created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /list/board/{boardId}:
 *   get:
 *     summary: Get all lists by board ID
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the board to get lists from
 *     responses:
 *       200:
 *         description: List of lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /list/{listId}:
 *   get:
 *     summary: Get a list by ID
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the list to retrieve
 *     responses:
 *       200:
 *         description: List details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       404:
 *         description: List not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /list/{listId}:
 *   delete:
 *     summary: Delete a list
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the list to delete
 *     responses:
 *       200:
 *         description: List deleted successfully
 *       404:
 *         description: List not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /list/{listId}:
 *   put:
 *     summary: Edit a list
 *     tags: [List]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/List'
 *     responses:
 *       200:
 *         description: List updated successfully
 *       404:
 *         description: List not found
 *       500:
 *         description: Internal server error
 */

import express from 'express';
import listController from '../controllers/listController.js';  // Using import
const router = express.Router();

router.get('/:listId', listController.getListById);
router.post('/', listController.createList);
router.get('/board/:boardId', listController.getAllListByBoard);
router.delete('/:listId', listController.deleteList);
router.put('/:listId', listController.editList);

export default router;