import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { apiUserAllWorkspaceByUser, apiUserCreateWorkspace, apiWorkspaceCreateBoard } from '../services/api';
import { BoardForm } from '../components/BoardForm';
import Workspace from '../components/Workspace';
import { getAuth } from 'firebase/auth';

const UserBoards = () => {
    const auth = getAuth();
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [workspacesData, setWorkspacesData] = useState([]);
    const [currentWorkspace, setCurrentWorkspace] = useState(null);

    async function fetchWorkspaces (userId) {
        const res = await apiUserAllWorkspaceByUser(userId);
        setWorkspacesData(res.data);
        console.log(JSON.stringify(res.data));
    }

    async function createBoard (board, onBoardCreated) {
        board.workspaceId = currentWorkspace;
        const res = await apiWorkspaceCreateBoard(board);
        onBoardCreated(res.data);

    }

    async function createWorkspace (workspace, onWorkspaceCreated) {
        const res = await apiUserCreateWorkspace(workspace);
        onWorkspaceCreated(res.data);
        console.log(JSON.stringify(res.data));
    }

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            fetchWorkspaces(currentUser.uid);
        }
    }, [auth]);

    return (
        <div>
            <Dialog
                open={ showBoardForm }
                onClose={ () => setShowBoardForm(false) }>
                <DialogTitle>Create Board</DialogTitle>
                <DialogContent>
                    <BoardForm
                        onBoardFormSummited={ (newBoard) => {
                            const currentUser = auth.currentUser;
                            if (currentUser) {
                                newBoard.ownerId = currentUser.uid;
                                createBoard(newBoard, () => {
                                    setShowBoardForm(false);
                                    fetchWorkspaces(currentUser.uid);
                                });
                            }
                        } }
                    />
                </DialogContent>
            </Dialog>

            <Stack>
                { workspacesData.map((workspace, index) => (
                    <Workspace
                        key={ index }
                        workspace={ workspace }
                        onClickCreate={ (id) => {
                            setCurrentWorkspace(id);
                            setShowBoardForm(true);
                        } }
                    />
                )) }
                <Box sx={ {
                    p: 2
                } }>
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={ () => {
                            const currentUser = auth.currentUser;
                            if (currentUser) {
                                createWorkspace({ ownerId: currentUser.uid }, () => fetchWorkspaces(currentUser.uid));
                            }
                        } }
                        sx={ {
                            flexGrow: 0,
                            flexShrink: 0,
                            width: '200px',
                            height: '100px',
                            overflow: ' hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        } }>
                        New workspace
                    </Button>
                </Box>
            </Stack>

            <TextField label="BoardId" variant="outlined" />
        </div>
    );
};

export default UserBoards;