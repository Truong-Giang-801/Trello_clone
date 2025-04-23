import { ListMongoose } from "../models/ListModel.js";

class ListService {
  constructor() {}

  // Tạo mới một list
  async createList(listData) {
    try {
      const newList = new ListMongoose(listData);
      const saved = await newList.save();
      return saved;
    } catch (error) {
      console.error("Create List Error:", error);
      throw error;
    }
  }

  // Lấy list theo id
  async getListById(listId) {
    try {
      const list = await ListMongoose.findOne({ _id: listId }).exec();
      return list;
    } catch (error) {
      console.error("Get List Error:", error);
      throw error;
    }
  }

  // Lấy tất cả list theo boardId
  async getAllListByBoard(boardId) {
    try {
      const lists = await ListMongoose.find({ boardId }).sort({ position: 1 }).exec();
      return lists;
    } catch (error) {
      console.error("Get All Lists Error:", error);
      throw error;
    }
  }

  // Chỉnh sửa thông tin list
  async editList(listId, updateData) {
    try {
      const updatedList = await ListMongoose.findByIdAndUpdate(listId, updateData, {
        new: true,
      });
      return updatedList;
    } catch (error) {
      console.error("Edit List Error:", error);
      throw error;
    }
  }

  // Xoá list
  async deleteList(listId) {
    try {
      const deleted = await ListMongoose.findByIdAndDelete(listId);
      return deleted;
    } catch (error) {
      console.error("Delete List Error:", error);
      throw error;
    }
  }
}

export default ListService;
