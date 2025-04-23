import { BoardMongoose } from "../models/BoardModel.js";

class BoardService {

    constructor() {

    }


    async createBoard (board) {
        try {
            const ref = board.toMongoDB();
            const res = ref.save();
            return res;
        } catch (error) {
            return error;
        }
    }

    async getAllBoardByWorkspace (workspaceId) {
        try {
            const ref = await BoardMongoose.find({ workspace: workspaceId }).exec();
            return ref;
        } catch (error) {
            return error;
        }
    }

    async getAllPublicBoard () {
        try {
            const ref = await BoardMongoose.find({ workspace: 'public' }).exec();
            return ref;
            // const userBoards = this.collection.filter((board) => board.visibility === true);
            // return userBoards;
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

    async deleteBoard (boardId) {

        try {
            const index = this.collection.findIndex(board => board.boardId === boardId);
            if (index > -1) {
                console.log("FOUND");
                this.collection.splice(index, 1);
            }
            return this.collection;
        } catch (error) {
            return error;
        }
    }
}

export default BoardService;
