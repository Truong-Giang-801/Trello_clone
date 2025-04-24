import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { apiUserAllWorkspaceByUser, apiUserCreateWorkspace, apiWorkspaceCreateBoard } from '../services/api';
import { BoardForm } from '../components/BoardForm';
import Workspace from '../components/Workspace';
import { getAuth } from 'firebase/auth';
import WorkspaceForm from '../components/WorkspaceForm';

const UserBoards = () => {
    const auth = getAuth();
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
    const [workspacesData, setWorkspacesData] = useState([]);
    const [currentWorkspace, setCurrentWorkspace] = useState(null);

    // Fetch all workspaces for the user
    async function fetchWorkspaces(userId) {
        const res = await apiUserAllWorkspaceByUser(userId);
        setWorkspacesData(res.data);
    }

    // Create a new board in the current workspace
    async function createBoard(board, onBoardCreated) {
        if (!currentWorkspace) {
            console.error("No workspace selected");
            return;
        }
        board.workspaceId = currentWorkspace;
        const res = await apiWorkspaceCreateBoard(board);
        onBoardCreated(res.data);
    }

    // Create a new workspace
    async function createWorkspace(workspace, onWorkspaceCreated) {
        const res = await apiUserCreateWorkspace(workspace);
        onWorkspaceCreated(res.data);
    }

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchWorkspaces(currentUser.uid);
        }
    }, [auth]);

    return (
        <div>
            {/* Dialog to create a new board */}
            <Dialog
                open={showBoardForm}
                onClose={() => setShowBoardForm(false)}>
                <DialogTitle>Create Board</DialogTitle>
                <DialogContent>
                    <BoardForm
                        onBoardFormSummited={(newBoard) => {
                            const currentUser = auth.currentUser;
                            if (currentUser) {
                                newBoard.ownerId = currentUser.uid;
                                createBoard(newBoard, () => {
                                    setShowBoardForm(false);
                                    fetchWorkspaces(currentUser.uid);
                                });
                            }
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={ showWorkspaceForm }
                onClose={ () => showWorkspaceForm(false) }>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogContent>
                    <WorkspaceForm
                        onFormSummited={ (newWorkspace) => {
                            const currentUser = auth.currentUser;
                            if (currentUser) {

                                newWorkspace.ownerId = currentUser.uid;
                                createWorkspace({ ownerId: currentUser.uid }, () => fetchWorkspaces(currentUser.uid));
                                createBoard(newWorkspace, () => {
                                    setShowBoardForm(false);
                                    fetchWorkspaces(currentUser.uid);
                                });
                            }
                        } }
                    />
                </DialogContent>
            </Dialog>

            {/* Display all workspaces */}
            <Stack>
                {workspacesData.map((workspace, index) => (
                    <Workspace
                        key={index}
                        workspace={workspace}
                        onClickCreate={(id) => {
                            setCurrentWorkspace(id);
                            setShowBoardForm(true);
                        }}
                    />
                ))}
                
                {/* Button to create a new workspace */}
                <Box sx={{ p: 2 }}>
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={() => {
                            const currentUser = auth.currentUser;
                            if (currentUser) {
                                showWorkspaceForm(true);
                                // createWorkspace({ ownerId: currentUser.uid }, () => fetchWorkspaces(currentUser.uid));
                            }
                        }}
                        sx={{
                            flexGrow: 0,
                            flexShrink: 0,
                            width: '200px',
                            height: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                        New workspace
                    </Button>
                </Box>
            </Stack>

            {/* TextField for BoardId (perhaps for testing or as a placeholder) */}
            <TextField label="BoardId" variant="outlined" />
        </div>
    );
};

export default UserBoards;
