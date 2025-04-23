import { BoardModel } from "../models/BoardModel.js";
import BoardService from "../services/BoardService.js";

const boardService = new BoardService();

async function createBoard (req, res) {
    try {
        const { ownerId, title, workspaceId, visibility } = req.body;
        const board = new BoardModel({ ownerId, title, workspaceId, visibility });
        const createdBoard = await boardService.createBoard(board);
        res.status(201).json(createdBoard); // Created response
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Internal server error');
    }
}

async function getBoard (req, res) {
    try {
        const { boardId } = req.params;
        const boards = await boardService.getBoard(boardId);
        res.status(200).json(boards); // OK response for fetching data
    } catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}

async function getAllBoardByWorkspace (req, res) {
    try {
        const { workspaceId } = req.params;
        const boards = await boardService.getAllBoardByWorkspace(workspaceId);
        res.status(200).json(boards); // OK response for fetching data
    } catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}

async function getAllBoardPublic (req, res) {
    try {
        const boards = await boardService.getAllPublicBoard();
        res.status(200).json(boards); // OK response for fetching data
    } catch (error) {
        console.error('Error getting board:', error);
        res.status(500).send('Internal server error');
    }
}

async function deleteBoard (req, res) {
    try {
        const { boardId } = req.params;
        const deletedBoard = await boardService.deleteBoard(boardId);
        console.log(`Board with ID ${boardId} deleted`); // More informative log
        res.status(200).json(deletedBoard); // OK response for successful deletion
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).send('Internal server error');
    }
}

// Export all functions as default
export default {
    createBoard,
    getBoard,
    getAllBoardByWorkspace,
    getAllBoardPublic,
    deleteBoard
};
