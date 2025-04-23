import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  ownerId: String,
  title: String,
  workspaceId: String,
  visibility: String,
  memberIds: Array,
  listIds: Array,
});

export const BoardMongoose = mongoose.model('Board', BoardSchema);

export class BoardModel {
  constructor({
    ownerId = '',
    title = '',
    workspaceId = '',
    visibility = '',
    memberIds = [],
  } = {}) {
    this.ownerId = ownerId;
    this.title = title;
    this.workspaceId = workspaceId;
    this.visibility = visibility;
    this.memberIds = memberIds;
  }

  static fromMongoDB (board) {

  }

  toMongoDB () {
    return new BoardMongoose({ userId: this.userId, boardId: this.boardId, title: this.title, visibility: this.visibility, workspaceId: this.workspaceId });
  }

  createList () {

  }

  editBoard () {

  }
}


export default BoardModel;