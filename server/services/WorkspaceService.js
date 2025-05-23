import { WorkspaceMongoose } from "../models/WorkspaceModel.js";

export class WorkspaceService {

  async createWorkspace (workspace) {
    try {
      const ref = workspace.toMongoDB();
      const res = ref.save();
      return res;
    } catch (error) {
      return error;
    }
  }

  async getWorkspace (id) {
    try {
      const ref = await WorkspaceMongoose.findById(id).exec();
      return ref;
    } catch (error) {
      return error;
    }
  }

  async getAllWorkspaceByUser (ownerId) {
    try {
      const ref = await WorkspaceMongoose.find({ ownerId: ownerId }).exec();
      return ref;
    } catch (error) {
      return error;
    }
  }

  async updateWorkspace (workspace, workspaceId) {
    try {
      const ref = await WorkspaceMongoose.findOneAndUpdate({ _id: workspaceId }, {
        title: workspace.title,
        description: workspace.description,
        members: workspace.members,
        ownerId: workspace.ownerId,
      }).exec();

      return ref;
    } catch (error) {
      return error;
    }
  }
  async getAllWorkspaces() {
    try {
      const workspaces = await WorkspaceMongoose.find().exec();
      return workspaces;
    } catch (error) {
      console.error("Error fetching all workspaces:", error);
      throw error;
    }
  }

  // async updateBoard (userId, userData) {
  //   console.log(userId);
  //   const userRef = this.collection.doc(userId);
  //   await userRef.update(userData);
  //   const updatedUser = await this.getUserById(userId);
  //   return updatedUser;
  // }

  // async deleteBoard (boardId) {

  //   try {
  //     const index = this.collection.findIndex(board => board.boardId === boardId);
  //     if (index > -1) {
  //       console.log("FOUND");
  //       this.collection.splice(index, 1);
  //     }
  //     return this.collection;
  //   } catch (error) {
  //     return error;
  //   }
  //   await userRef.delete();
  // }
}

export default WorkspaceService;
