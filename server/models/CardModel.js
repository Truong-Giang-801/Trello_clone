import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  title: String,
  position: Number,
  listId: String,
  dueDate: Date,
  assignMember: [String],
});

export const CardMongoose = mongoose.model('Card', CardSchema);

export class CardModel {
  constructor({
    title = '',
    position = 0,
    listId = '',
    dueDate = Date.now(),
    assignMember = [],
  } = {}) {
    this.title = title;
    this.position = position;
    this.listId = listId;
    this.dueDate = dueDate;
    this.assignMember = assignMember;
  }
}

export default CardModel;