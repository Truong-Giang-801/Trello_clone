import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardPublic } from '../services/api';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// import axios from 'axios';

const PublicBoards = () => {
    const navigate = useNavigate();
    const [boardsData, setBoardsData] = useState([]);

    async function fetchBoards () {
        console.log(`Fetching public boards`);
        const res = await apiBoardGetAllBoardPublic();

        setBoardsData(res.data);
        console.log("boards: " + JSON.stringify(res.data, null, 2));
    }

    function handleBoardClick () {
        navigate('/board');
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <Grid
            container
            spacing={ 3 }
            sx={ {
                p: 2,
                display: "inline-flex",
                overflow: "hidden",
                overflowY: "scroll",
                height: 1
            } }>
            {
                boardsData.map((board, index) => {
                    return (
                        <Grid size='grow'>
                            <Button
                                size='large'
                                onClick={ handleBoardClick }
                                variant="contained"
                                sx={ {
                                    flexGrow: 0,
                                    flexShrink: 0,
                                    width: '200px',
                                    height: '100px'
                                } } >
                                { board.title }
                            </Button>
                        </Grid>);
                })
            }
        </Grid>
    );
};

export default PublicBoards;
