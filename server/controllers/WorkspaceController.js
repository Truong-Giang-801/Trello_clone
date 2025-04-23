import WorkspaceService from '../services/WorkspaceService.js';
import WorkspaceModel from '../models/WorkspaceModel.js';

const workspaceService = new WorkspaceService(); // Instantiate the service

async function createWorkspace (req, res) {
    try {
        const { title, description, ownerId, members } = req.body;
        const workspace = new WorkspaceModel({ title, description, ownerId, members });
        const createdWorkspace = await workspaceService.createWorkspace(workspace);
        res.status(201).json(createdWorkspace);
    } catch (error) {
        console.error('Error creating workspace:', error);
        res.status(500).send('Internal server error');
    }
}

async function getAllWorkspaceByUser (req, res) {
    try {
        const { ownerId } = req.params;
        const workspaces = await workspaceService.getAllWorkspaceByUser(ownerId);
        res.status(201).json(workspaces);
    } catch (error) {
        console.error('Error getting workspace:', error);
        res.status(500).send('Internal server error');
    }
}

export default {
    createWorkspace,
    getAllWorkspaceByUser
};