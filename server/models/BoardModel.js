import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  userId: String,
  boardId: String,
  title: String,
  workspace: String,
});

export const BoardMongoose = mongoose.model('Board', BoardSchema);

export class BoardModel {
  constructor({
    userId = '',
    boardId = '',
    title = '',
    workspace = '',
  } = {}) {
    this.userId = userId;
    this.boardId = boardId;
    this.title = title;
    this.workspace = workspace;
  }

  static fromMongoDB (board) {

  }

  toMongoDB () {
    return new BoardMongoose({ userId: this.userId, boardId: this.boardId, title: this.title, visibility: this.visibility, workspace: this.workspace });
  }

  createList () {

  }

  editBoard () {

  }
}


export default BoardModel;