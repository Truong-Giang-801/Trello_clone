import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardPublic } from '../services/api';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BoardButton from '../components/BoardButton';

// import axios from 'axios';

const PublicBoards = () => {
    const navigate = useNavigate();
    const [boardsData, setBoardsData] = useState([]);

    async function fetchBoards () {
        console.log(`Fetching public boards`);
        const res = await apiBoardGetAllBoardPublic();

        setBoardsData(res.data);
        // console.log("boards: " + JSON.stringify(res.data, null, 2));
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <Grid
            container
            // direction='row'
            spacing={ 3 }
            sx={ {
                p: 2,
                display: "flex",
                // flexDirection: "row",
                // height: 100,
                overflow: "hidden",
                overflowY: "scroll",
            } }>
            {
                boardsData.map((board, index) => {
                    return (
                        <BoardButton board={ board }></BoardButton>
                    );
                })
            }
        </Grid>
    );
};

export default PublicBoards;
