import { Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardByWorkspace } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Workspace = ({ workspace, onClickCreate }) => {
    const navigate = useNavigate();
    const [boardsData, setBoardsData] = useState([]);

    async function fetchBoards () {
        console.log("Fetching board with workspace id: " + workspace._id);
        const res = await apiBoardGetAllBoardByWorkspace(workspace._id);
        setBoardsData(res.data ? res.data : []);
        console.log("board with workspace id " + workspace._id + " " + JSON.stringify(boardsData, null, 2));
    }

    function handleBoardClick () {
        navigate('/board');
    }

    useEffect(() => {
        fetchBoards();
    }, [boardsData]);

    return (
        <div>
            <h2> { workspace.title }</h2>
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
                {/* { console.log(boardsData) } */ }
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
                                    width: '200px',
                                    overflow: ' hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                } } >
                                { board.title }
                            </Button>);
                    })
                }
                <Button
                    size='large'
                    variant='outlined'
                    // onClick={ () => setShowBoardForm(true) }
                    onClick={ () => onClickCreate(workspace._id) }
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

export default Workspace;
