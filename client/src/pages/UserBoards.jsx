import { Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { apiWorkspaceCreateBoard, apiWorkspaceGetAllBoardByUser } from '../services/api';
import { BoardForm } from '../components/BoardForm';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserBoards = () => {
    const navigate = useNavigate();
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [boardsData, setBoardsData] = useState([]);
    const { user } = useContext(UserContext);

    async function fetchBoards (userId) {
        console.log(`Fetching user ${userId} boards`);
        // const res = await apiWorkspaceGetAllBoardByUser(userId);

        setBoardsData(res.data);
        // onResponse();
        console.log("boards: " + JSON.stringify(res.data, null, 2));

        // return res;
    }

    async function createBoard (board, onBoardCreated) {
        const res = await apiWorkspaceCreateBoard(board);
        onBoardCreated(res.data);

    }

    function handleBoardClick () {
        navigate('/board');
    }

    useEffect(() => {
        fetchBoards(user.uid);
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
                                fetchBoards(user.uid);
                            });
                        } }
                    />
                </DialogContent>
            </Dialog>
            <Stack
                direction='row'
                spacing={ 3 }
                sx={ {
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    height: 100,
                    overflow: "hidden",
                    overflowX: "scroll",
                } }>
                {
                    boardsData.map((board, index) => {
                        return (
                            <Button
                                size='large'
                                onClick={ handleBoardClick }
                                variant="contained"
                                sx={ {
                                    flexGrow: 0,
                                    flexShrink: 0,
                                    width: '200px'
                                } } >
                                { board.title }
                            </Button>);
                    })
                }
                <Button
                    size='large'
                    variant='outlined'
                    onClick={ () => setShowBoardForm(true) }
                    sx={ {
                        flexGrow: 0,
                        flexShrink: 0,
                        width: '200px'
                    } } >
                    Tạo bảng mới
                </Button>
            </Stack>
        </div >
    );
};

export default UserBoards;
