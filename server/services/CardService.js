// CardService.js
import { CardMongoose } from "../models/CardModel.js";

class CardService {
  async getCardById(cardId) {
    try {
      const card = await CardMongoose.findById(cardId);
      return card;
    } catch (error) {
      throw error;
    }
  }

  // Tạo mới một card
  async createCard(cardData) {
    try {
      const newCard = new CardMongoose(cardData);
      const saved = await newCard.save();
      return saved;
    } catch (error) {
      console.error("Create Card Error:", error);
      throw error;
    }
  }

  async getAllCardByList(listId) {
    try {
      const cards = await CardMongoose.find({ listId });
      return cards;
    } catch (error) {
      throw error;
    }
  }

  async deleteCard(cardId) {
    try {
      const result = await CardMongoose.findByIdAndDelete(cardId);
      return { success: true, deletedCard: result };
    } catch (error) {
      throw error;
    }
  }

  async assignUser(cardId, userId) {
    try {
      // We first get the card to check if the user is already assigned
      const card = await CardMongoose.findById(cardId);
      if (!card) {
        throw new Error('Card not found');
      }
      
      // Initialize assignMember array if it doesn't exist
      if (!card.assignMember) {
        card.assignMember = [];
      }
      
      // Check if user is already assigned to avoid duplicates
      if (!card.assignMember.includes(userId)) {
        card.assignMember.push(userId);
      }
      
      const updatedCard = await card.save();
      return updatedCard;
    } catch (error) {
      throw error;
    }
  }

  async removeAssignedUser(cardId, userId) {
    try {
      const updatedCard = await CardMongoose.findByIdAndUpdate(
        cardId,
        { $pull: { assignMember: userId } },
        { new: true }
      );
      return updatedCard;
    } catch (error) {
      throw error;
    }
  }

  async editCard(cardId, updates) {
    try {
      const updatedCard = await CardMongoose.findByIdAndUpdate(
        cardId,
        updates,
        { new: true }
      );
      return updatedCard;
    } catch (error) {
      throw error;
    }
  }
  // Add to CardService.js
  async updatePosition(cardId, listId, position) {
    try {
      const updatedCard = await CardMongoose.findByIdAndUpdate(
        cardId,
        { listId, position },
        { new: true }
      );
      return updatedCard;
    } catch (error) {
      throw error;
    }
  }
}

export default CardService;