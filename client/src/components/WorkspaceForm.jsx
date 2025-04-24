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

export const WorkspaceForm = ({ onFormSummited }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [interactable, setInteractable] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert('Please fill out all fields');
      return;
    }

    onFormSummited({ title, description });
    setTitle('');
    setDescription('');
    setInteractable(false);
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

            <TextField
              label="Description"
              value={ description }
              onChange={ (e) => setDescription(e.target.value) }
              required
              fullWidth
              variant="outlined"
              multiline
              rows={ 4 }
            />

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

export default WorkspaceForm;