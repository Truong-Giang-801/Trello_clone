import { Button, Dialog, DialogContent, DialogTitle, Input, Stack, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { apiUserAllWorkspaceByUser, apiUserCreateWorkspace, apiWorkspaceCreateBoard, apiWorkspaceDeleteBoard, apiWorkspaceGetAllBoardByUser, apiWorkspaceGetAllWorkspaceByUser } from '../services/api';
import { BoardForm } from '../components/BoardForm';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Workspace from '../components/Workspace';

const UserBoards = () => {
    const navigate = useNavigate();
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [boardsData, setBoardsData] = useState([]);
    const [workspacesData, setWorkspacesData] = useState([]);
    const [currentWorkspace, setcurrentWorkspace] = useState();
    const { user } = useContext(UserContext);

    // async function fetchBoards (userId) {
    //     console.log(`Fetching user ${userId} boards`);
    //     const res = await apiWorkspaceGetAllBoardByUser(userId);

    //     setBoardsData(res.data);
    //     // onResponse();
    //     console.log("boards: " + JSON.stringify(res.data, null, 2));

    //     // return res;
    // }

    async function fetchWorkspaces (userId) {

        // console.log(`Fetching user ${userId} workspace`);
        const res = await apiUserAllWorkspaceByUser(userId);

        setWorkspacesData(res.data);
        // onResponse();
        // console.log("workspace: " + JSON.stringify(res.data, null, 2));
    }

    async function createBoard (board, onBoardCreated) {
        board.workspace = currentWorkspace;

        console.log(JSON.stringify(board));
        const res = await apiWorkspaceCreateBoard(board);
        onBoardCreated(res.data);
    }

    async function createWorkspace (workspace, onWorkspaceCreated) {
        const res = await apiUserCreateWorkspace(workspace);
        onWorkspaceCreated(res.data);
    }

    // async function deleteBoard (boardId, onBoardDeleted) {
    //     const res = await apiWorkspaceDeleteBoard(boardId);
    //     onBoardDeleted(res.data);
    // }

    function handleBoardClick () {
        navigate('/board');
    }

    useEffect(() => {
        // fetchBoards(user.uid);
        fetchWorkspaces(user.uid);
    }, [user]);

    return (
        <div>
            <Dialog
                open={ showBoardForm }
                onClose={ () => setShowBoardForm(false) }>
                <DialogTitle>
                    Create Board
                </DialogTitle>
                <DialogContent>
                    <BoardForm
                        onBoardFormSummited={ (newBoard) => {
                            newBoard.userId = user.uid;
                            createBoard(newBoard, () => {
                                setShowBoardForm(false);
                                fetchWorkspaces(user.uid);
                            });
                        } }
                    />
                </DialogContent>
            </Dialog>

            <Stack>
                {
                    workspacesData.map((workspace, index) => {
                        return (
                            <Workspace workspace={ workspace } onClickCreate={ (id) => {
                                setcurrentWorkspace(id);
                                setShowBoardForm(true);
                            } }></Workspace>
                        );
                    })
                }
            </Stack>

            {/* <Button
                size='large'
                variant='outlined'
                onClick={ () => deleteBoard(0, () => fetchBoards(user.uid)) }
                sx={ {
                    flexGrow: 0,
                    flexShrink: 0,
                    width: '200px',
                    color: 'red',
                    borderColor: 'red'
                } } >
                Delete
            </Button>
            <TextField
                label="BoardId"
                variant="outlined"
            /> */}
            <Button
                size='large'
                variant='outlined'
                onClick={ () => createWorkspace({ userId: user.uid }, () => fetchWorkspaces(user.uid)) }
                sx={ {
                    flexGrow: 0,
                    flexShrink: 0,
                    width: '200px',
                    color: 'red',
                } } >
                New workspace
            </Button>
            <TextField
                label="BoardId"
                variant="outlined"
            />
        </div >
    );
};

export default UserBoards;
