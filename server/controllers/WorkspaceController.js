import { BoardModel } from "../models/BoardModel.js";
import { WorkspaceService } from "../services/WorkspaceService.js";

// const BoardModel = require('../models/BoardModel');
// const WorkspaceService = require('../services/WorkspaceService');
const workspaceService = new WorkspaceService();

export async function createBoard (req, res) {
    try {
        const { userId, boardId, title, visiblity } = req.body;
        const board = new BoardModel({ userId, boardId, title, visiblity });

        const createdBoard = await workspaceService.createBoard(board);
        res.status(201).json(createdBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Internal server error');
    }
}

export async function getAllBoardByUser (req, res) {
    try {
        const { userId } = req.params;
        const createdBoard = await workspaceService.getAllBoardByUser(userId);
        res.status(201).json(createdBoard);
    }
    catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}