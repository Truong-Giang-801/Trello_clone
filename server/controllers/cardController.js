// Updated cardController.js with socket events for all operations

import { CardModel } from "../models/CardModel.js";
import CardService from "../services/CardService.js";

const cardService = new CardService();

// GET /:cardId → Get card by Id
export async function getCardById(req, res) {
  try {
    const { cardId } = req.params;
    const card = await cardService.getCardById(cardId);
    res.status(200).json(card);
  } catch (error) {
    console.error("Error getting card:", error);
    res.status(500).send("Internal server error");
  }
}

export async function createCard(req, res) {
  try {
    const card = new CardModel(req.body);
    const createdCard = await cardService.createCard(card);
    const io = req.app.get('socketio'); // get io instance
    io.emit('newCard', createdCard); // emit event
    res.status(201).json(createdCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).send("Internal server error");
  }
}

// GET /:listId → Get cards by List 
export async function getAllCardByList(req, res) {
  try {
    const { listId } = req.params;
    const cards = await cardService.getAllCardByList(listId);
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error getting cards:", error);
    res.status(500).send("Internal server error");
  }
}

export async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const deleted = await cardService.deleteCard(cardId);
    
    // Get the listId from the deleted card for the socket event
    const listId = deleted.deletedCard.listId;
    
    const io = req.app.get('socketio');
    io.emit('deleteCard', { cardId, listId }); // emit delete event with both IDs
    
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).send("Internal server error");
  }
}

// PATCH /cards/:cardId/assign
export async function assignUser(req, res) {
  try {
    const { cardId } = req.params;
    const { userId } = req.body;

    const updatedCard = await cardService.assignUser(cardId, userId);
    
    const io = req.app.get('socketio');
    io.emit('updateCard', updatedCard); // emit update event
    
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error assigning user to card:", error);
    res.status(500).send("Internal server error");
  }
}

// DELETE /cards/:cardId/assign/:userId
export async function removeAssignedUser(req, res) {
  try {
    const { cardId, userId } = req.params;
    
    const updatedCard = await cardService.removeAssignedUser(cardId, userId);
    
    const io = req.app.get('socketio');
    io.emit('updateCard', updatedCard); // emit update event
    
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error removing assigned user:", error);
    res.status(500).send("Internal server error");
  }
}

// PUT /cards/:cardId
export async function editCard(req, res) {
  try {
    const { cardId } = req.params;
    const updated = await cardService.editCard(cardId, req.body);
    
    const io = req.app.get('socketio');
    io.emit('updateCard', updated); // emit update event
    
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error editing card:", error);
    res.status(500).send("Internal server error");
  }
  
}

// Export all functions as default
export default {
  getCardById,
  createCard,
  getAllCardByList,
  deleteCard,
  assignUser,
  removeAssignedUser,
  editCard
};