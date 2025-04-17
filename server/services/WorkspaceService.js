import BoardModel from "../models/BoardModel.js";

export class WorkspaceService {
  constructor() {
    this.collection = [
      new BoardModel({ userId: '0', boardId: '1', title: 'B1', visiblity: true })
    ];
  }

  async createBoard (board) {
    // console.log("creating");
    try {
      board.boardId = this.collection.length;
      this.collection.push(board);
      return board;
    } catch (error) {
      return error;
    }
  }

  async getAllBoardByUser (userId) {
    try {

    } catch (error) {

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
