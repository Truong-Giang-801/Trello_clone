import mongoose from "mongoose";

const WorkspaceSchema = new mongoose.Schema({
  title: String,
  description: String,
  ownerId: String,
  members: Array,
});

export const WorkspaceMongoose = mongoose.model('Workspace', WorkspaceSchema);

class WorkspaceModel {
  constructor({
    title = '',
    description = '',
    ownerId = '',
    members: []
  } = {}) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.members = members;
  }

  toMongoDB () {
    return new WorkspaceMongoose({ title: this.title, description: this.description, ownerId: this.ownerId, members: this.members });
  }

  addBoard (board) {

  }

  removeBoard () {

  }
}

export default WorkspaceModel;