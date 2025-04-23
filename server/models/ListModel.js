import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  title: String,
  boardId: String,
  position: Number,
});

export const ListMongoose = mongoose.model('List', ListSchema);

export class ListModel {
  constructor({
    title = '',
    boardId = '',
    position = 0,
  } = {}) {
    this.title = title;
    this.boardId = boardId;
    this.position = position;
  }
}

export default ListModel;