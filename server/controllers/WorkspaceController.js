import { BoardModel } from "../models/BoardModel.js";
import { WorkspaceService } from "../services/WorkspaceService.js";

// const BoardModel = require('../models/BoardModel');
// const WorkspaceService = require('../services/WorkspaceService');
const workspaceService = new WorkspaceService();

export async function createBoard (req, res) {
    try {

        const { userId, title, visiblity } = req.body;
        const board = new BoardModel(userId, '', title, visiblity);

        const createdBoard = await workspaceService.createBoard(board);
        res.status(201).json(createdBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Internal server error');
    }
}