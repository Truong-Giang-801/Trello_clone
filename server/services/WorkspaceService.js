import BoardModel from "../models/BoardModel.js";

export class WorkspaceService {
  constructor() {
    this.collection = [
      new BoardModel({ userId: '0', boardId: '1', title: 'B1', visibility: true })
    ];
  }

  async createBoard (board) {
    try {
      board.boardId = this.collection.length;
      this.collection.push(board);
      return this.collection;
    } catch (error) {
      return error;
    }
  }

  async getAllBoardByUser (userId) {
    try {
      const userBoards = this.collection.filter((board) => board.userId === userId);

      console.log(userId);
      console.log(JSON.stringify(userBoards, null, 2));

      return userBoards;
    } catch (error) {
      return error;
    }
  }

  async updateBoard (userId, userData) {
    console.log(userId);
    const userRef = this.collection.doc(userId);
    await userRef.update(userData);
    const updatedUser = await this.getUserById(userId);
    return updatedUser;
  }

  async deleteBoard (userId) {
    const userRef = this.collection.doc(userId);
    await userRef.delete();
  }
}

export default WorkspaceService;
