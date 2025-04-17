import { Box, Button, createTheme, Stack, ThemeProvider } from '@mui/material';
import React from 'react';
import { apiWorkspaceCreateBoard } from '../services/api';

// import axios from 'axios';

const theme = createTheme({
    palette: {
        background: {
            paper: '#1976d2',
        },
        text: {
            primary: '#1976d2',
            secondary: '#fff'
        }
    },
});

async function createBoard () {
    const res = await apiWorkspaceCreateBoard({
        userId: '1',
        title: 'Bảng a',
        visibility: true
    });

    console.log("create" + JSON.stringify(res.data, null, 2));
}

function handleBoardClick () {

}

//  Mock data
const boards = [
    {
        id: '1',
        title: 'Bảng 1',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
    {
        id: '1',
        title: 'Bảng 1',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
    {
        id: '2',
        title: 'Bảng 2',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
    {
        id: '3',
        title: 'Bảng 3',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
    {
        id: '4',
        title: 'Bảng 4',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
    {
        id: '5',
        title: 'Bảng 5',
        position: 0,
        dueDate: { _seconds: 0, _nanoseconds: 0 },
    },
];

const UserBoards = () => {
    return (
        <div>
            <Stack direction='row' spacing={ 3 }
                sx={ {
                    p: 2,
                    display: "flex",
                    flexDirection: "row",
                    height: 100,
                    overflow: "hidden",
                    overflowX: "scroll",
                    // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
                } }>
                {
                    boards.map((board, index) => {
                        return (
                            <Button size='large' onClick={ handleBoardClick } variant="contained" >
                                { board.title }
                            </Button>);
                    })
                }
                <Button size='large' variant='outlined' onClick={ createBoard } >Tạo bảng mới</Button>
            </Stack>
        </div >
    );
};

export default UserBoards;
