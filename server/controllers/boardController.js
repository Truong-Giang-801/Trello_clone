import { BoardModel } from "../models/BoardModel.js";
import BoardService from "../services/BoardService.js";

const boardService = new BoardService();

export async function createBoard (req, res) {
    try {
        const { userId, workspace, title, visibility } = req.body;
        const board = new BoardModel({ userId, workspace, title, visibility });
        const createdBoard = await boardService.createBoard(board);
        res.status(201).json(createdBoard);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Internal server error');
    }
}

export async function getAllBoardByWorkspace (req, res) {
    try {
        const { workspaceId } = req.params;
        const boards = await boardService.getAllBoardByWorkspace(workspaceId);
        res.status(201).json(boards);
    }
    catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}

export async function getAllBoardPublic (req, res) {
    try {
        const boards = await boardService.getAllPublicBoard();
        res.status(201).json(boards);
    }
    catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}

export async function deleteBoard (req, res) {
    try {
        const { boardId } = req.params;
        const boards = await boardService.deleteBoard(boardId);
        console.log("Deleted");
        res.status(201).json(boards);
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).send('Internal server error');
    }
}