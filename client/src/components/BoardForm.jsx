import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';

export const BoardForm = ({ onBoardFormSummited }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [interactable, setInteractable] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert('Please fill out all fields');
      return;
    }


    onBoardFormSummited({ title, visibility });
    setTitle('');
    setVisibility(true);
    setInteractable(false);
    // try {
    //   const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/tasks`, newTask);
    //   alert('Task created successfully!');
    //   onBoardCreated({ ...newTask, id: response.data.id });

    // } catch (error) {
    //   console.error('Error board form:', error);
    //   alert('Error board form');
    // }
  };

  return (
    <Container maxWidth="sm">
      {
        () => setInteractable(true)
      }
      <Box
        sx={ {
          mt: 5,
          p: 4,
          border: '1px solid #ddd',
          borderRadius: '12px',
          boxShadow: 3,
          backgroundColor: 'white',
        } }
      >
        <Typography variant="h5" gutterBottom align="center">
          Create Board
        </Typography>

        <form onSubmit={ handleSubmit }>
          <Stack spacing={ 3 }>
            <TextField
              label="Title"
              value={ title }
              onChange={ (e) => setTitle(e.target.value) }
              required
              fullWidth
              variant="outlined"
              disabled={ !interactable }
            />

            <FormControlLabel
              fullWidth
              variant="outlined"
              required
              control={
                <Switch
                  defaultChecked
                  value={ visibility }
                  disabled={ !interactable }
                  onChange={ (e) => setVisibility(e.target.value) } /> }
              label="Visibility" />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={ !interactable }
            >
              Create Board
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default BoardForm;