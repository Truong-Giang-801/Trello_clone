/**
 * @swagger
 * tags:
 *   name: Card
 *   description: API endpoints for managing cards
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - title
 *         - position
 *         - listId
 *         - dueDate
 *         - assignMember
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the card
 *           example: Fix login bug
 *         position:
 *           type: number
 *           description: Position of the card in the list
 *           example: 2
 *         listId:
 *           type: string
 *           description: The ID of the list that contains this card
 *           example: list-123
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date of the card
 *           example: 2025-05-01T12:00:00Z
 *         assignMember:
 *           type: array
 *           items:
 *             type: string
 *           description: List of user IDs assigned to the card
 *           example: [ "user123", "user456" ]
 */

/**
 * @swagger
 * /card:
 *   post:
 *     summary: Create a new card
 *     tags: [Card]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: Card created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /card/list/{listId}:
 *   get:
 *     summary: Get all cards by list ID
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the list to retrieve cards from
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /card/{cardId}:
 *   get:
 *     summary: Get a card by ID
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the card to retrieve
 *     responses:
 *       200:
 *         description: Card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /card/{cardId}:
 *   delete:
 *     summary: Delete a card
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the card to delete
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /card/{cardId}:
 *   put:
 *     summary: Edit a card
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /card/{cardId}/assign:
 *   patch:
 *     summary: Assign user(s) to a card
 *     tags: [Card]
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignMember:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "user789", "user999" ]
 *     responses:
 *       200:
 *         description: Card assignment updated
 *       404:
 *         description: Card not found
 *       500:
 *         description: Internal server error
 */

import express from 'express';
import cardController from '../controllers/cardController.js';  // Using import
const router = express.Router();

router.get('/:cardId', cardController.getCardById);
router.post('/', cardController.createCard);
router.get('/list/:listId', cardController.getAllCardByList);
router.delete('/:cardId', cardController.deleteCard);
router.patch('/:cardId/assign', cardController.assignUser);
router.put('/:cardId', cardController.editCard);

export default router;