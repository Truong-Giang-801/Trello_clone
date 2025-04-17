import { Box, Button, createTheme, ThemeProvider } from '@mui/material';
import React from 'react';
import { apiCreateBoard } from '../services/api';

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

async function createBoard() {
    const res = await apiCreateBoard();

    console.log(res.data);
}

const UserBoards = () => {
    return (
        <div>
            <ThemeProvider theme={theme}>
                <Box sx={{ p: 2, display: 'flex', gap: 3 }}>
                    <Box sx={{ p: 2 }}>
                        <Button>Bảng 1</Button>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Button>Bảng 2</Button>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Button>Bảng 3</Button>
                    </Box>
                    <Button size='large' variant='outlined' onClick={createBoard}>Tạo bảng mới</Button>
                </Box>
            </ThemeProvider>
        </div>
    );
};

export default UserBoards;
