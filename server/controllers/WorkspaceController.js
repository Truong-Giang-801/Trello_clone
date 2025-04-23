import { json } from "express";
import { WorkspaceService } from "../services/WorkspaceService.js";
import WorkspaceModel from "../models/WorkspaceModel.js";

const workspaceService = new WorkspaceService();

export async function createWorkspace (req, res) {
    try {
        const { id, title, description, userId } = req.body;
        const workspace = new WorkspaceModel({ id, title, description, userId });

        const createdBoard = await workspaceService.createWorkspace(workspace);
        res.status(201).json(createdBoard);
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).send('Internal server error');
    }
}

export async function getAllWorkspaceByUser (req, res) {
    try {
        const { userId } = req.params;
        const boards = await workspaceService.getAllWorkspaceByUser(userId);
        res.status(201).json(boards);
    }
    catch (error) {
        console.error('Error getting workspace:', error);
        res.status(500).send('Internal server error');
    }
}

// export async function deleteBoard (req, res) {
//     try {
//         const { boardId } = req.params;
//         const boards = await workspaceService.deleteBoard(boardId);
//         console.log("Deleted");
//         res.status(201).json(boards);
//     } catch (error) {
//         console.error('Error deleting board:', error);
//         res.status(500).send('Internal server error');
//     }
// }