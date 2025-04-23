import { CardModel } from "../models/CardModel.js";
import CardService from "../services/CardService.js";

const cardService = new CardService();

// GET /:cardId → Lấy card theo Id
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
    const io = req.app.get('socketio'); // lấy instance của io
    io.emit('newCard', createCard); // phát event
    res.status(201).json(createdCard);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).send("Internal server error");
  }
}

// GET /:listId → Lấy card theo List 
export async function getAllCardByList(req, res) {
  try {
    const { listId } = req.params;
    const cards = await cardService.getAllCardByList(listId);
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error getting card:", error);
    res.status(500).send("Internal server error");
  }
}

export async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const deleted = await cardService.deleteCard(cardId);
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
    res.status(200).json(updatedCard);
  } catch (error) {
    console.error("Error assigning user to card:", error);
    res.status(500).send("Internal server error");
  }
}

// PUT /cards/:cardId
export async function editCard(req, res) {
  try {
    const { cardId } = req.params;
    const updated = await cardService.editCard(cardId, req.body);
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
  editCard
};