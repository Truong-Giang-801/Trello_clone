import React, { useEffect, useState } from 'react';
import { apiBoardGetAllBoardPublic } from '../services/api';
import { Grid2 } from '@mui/material';
import BoardButton from '../components/BoardButton';

// import axios from 'axios';

const PublicBoards = () => {
    const [boardsData, setBoardsData] = useState([]);

    async function fetchBoards () {
        // console.log(`Fetching public boards`);
        const res = await apiBoardGetAllBoardPublic();

        setBoardsData(res.data);
    }

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <Grid2
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
                        <BoardButton board={ board } key={ index }></BoardButton>
                    );
                })
            }
        </Grid2>
    );
};

export default PublicBoards;
