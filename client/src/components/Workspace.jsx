import { Button, Stack, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardByWorkspace } from '../services/api';
import BoardButton from './BoardButton';
import { useNavigate } from 'react-router-dom';

const Workspace = ({ workspace, onClickCreate }) => {
    const navigate = useNavigate();
    const [boardsData, setBoardsData] = useState([]);

    useEffect(() => {
        const fetchBoards = async () => {
            const res = await apiBoardGetAllBoardByWorkspace(workspace._id);
            // console.log(JSON.stringify(res.data));
            setBoardsData(res.data ? res.data : []);
        };

        fetchBoards();
    }, [workspace]);

    function handleSettingClicked () {
        navigate(`/workspace/${workspace._id}`);
    }

    return (
        <div>
            <Toolbar sx={ { display: 'flex', justifyContent: 'space-between' } }>
                <Typography variant="h6">
                    { workspace.title }
                </Typography>
                <Button onClick={ handleSettingClicked }>
                    Cài đặt
                </Button>
            </Toolbar>
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
