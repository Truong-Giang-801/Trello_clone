import { Button, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardByWorkspace } from '../services/api';
import BoardButton from './BoardButton';

const Workspace = ({ workspace, onClickCreate }) => {
    const [boardsData, setBoardsData] = useState([]);

    useEffect(() => {
        const fetchBoards = async () => {
            const res = await apiBoardGetAllBoardByWorkspace(workspace._id);
            // console.log(JSON.stringify(res.data));
            setBoardsData(res.data ? res.data : []);
        };

        fetchBoards();
    }, [workspace]);

    return (
        <div>
            <Typography
                variant="h6"
                sx={ {
                    paddingLeft: 2
                } }>
                { workspace.title }
            </Typography>
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
                            <BoardButton board={ board } key={ index } />
                        );
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
                        width: '200px',
                        height: '100px',
                        overflow: ' hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    } } >
                    Tạo bảng mới
                </Button>
            </Stack>
        </div >
    );
};

export default Workspace;
