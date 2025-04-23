import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardButton = ({ board }) => {
    const navigate = useNavigate();

    function handleBoardClick () {
        navigate(`/board/${board._id}`);
    }

    return (
        <Button
            size='large'
            onClick={ handleBoardClick }
            variant="contained"
            sx={ {
                flexGrow: 0,
                flexShrink: 0,
                width: '200px',
                height: '100px',
                overflow: ' hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            } } >
            { board.title }
        </Button>
    );
};

export default BoardButton;