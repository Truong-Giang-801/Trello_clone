import { CardMongoose } from "../models/CardModel.js";

class CardService {
  constructor() {}

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

  // Lấy card theo id
  async getCardById(cardId) {
    try {
      const card = await CardMongoose.findOne({ _id: cardId }).exec();
      return card;
    } catch (error) {
      console.error("Get Card Error:", error);
      throw error;
    }
  }

  // Lấy tất cả card theo listId
  async getAllCardByList(listId) {
    try {
      const cards = await CardMongoose.find({ listId }).sort({ position: 1 }).exec();
      return cards;
    } catch (error) {
      console.error("Get All Cards Error:", error);
      throw error;
    }
  }

  // Gán user vào card (assign)
  async assignUser(cardId, userId) {
    try {
      const card = await CardMongoose.findById(cardId);
      if (!card) throw new Error("Card not found");

      if (!card.assignMember.includes(userId)) {
        card.assignMember.push(userId);
      }

      return await card.save();
    } catch (error) {
      console.error("Assign User Error:", error);
      throw error;
    }
  }

  // Chỉnh sửa thông tin card
  async editCard(cardId, updateData) {
    try {
      const updatedCard = await CardMongoose.findByIdAndUpdate(cardId, updateData, {
        new: true,
      });
      return updatedCard;
    } catch (error) {
      console.error("Edit Card Error:", error);
      throw error;
    }
  }

  // Xoá card
  async deleteCard(cardId) {
    try {
      const deleted = await CardMongoose.findByIdAndDelete(cardId);
      return deleted;
    } catch (error) {
      console.error("Delete Card Error:", error);
      throw error;
    }
  }
}

export default CardService;
