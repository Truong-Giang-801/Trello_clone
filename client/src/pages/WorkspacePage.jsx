import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Toolbar,
  Avatar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGetWorkspace, apiUpdateWorkspace } from '../services/api';

export const WorkspacePage = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [newMember, setNewMember] = useState('');

  useEffect(() => {
    const fetchWorkspace = async () => {
      const res = await apiGetWorkspace(workspaceId);
      setWorkspace(res.data);

    };

    fetchWorkspace();
  }, []);

  const updateTitle = (title) => {
    setWorkspace(previousState => {
      return { ...previousState, title: title };
    });
  };

  const updateDescription = (description) => {
    setWorkspace(previousState => {
      return { ...previousState, description: description };
    });
  };

  const updateMember = (member) => {
    setWorkspace(previousState => {
      return { ...previousState, members: [...previousState.members, member] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!workspace.title) {
      alert('Please fill out all fields');
      return;
    }

    // onFormSummited({ title, description });
    const res = await apiUpdateWorkspace(workspace, workspace._id);
    console.log(JSON.stringify(res.data));
    navigate('/private');
  };

  const handleAdd = () => {
    updateMember(newMember);
  };

  return (
    <Box sx={ { p: 2 } }>
      <Typography variant="h5" gutterBottom align="center">
        Update Workspace
      </Typography>

      <form onSubmit={ handleSubmit }>
        <Stack spacing={ 3 }>
          <TextField
            label="Title"
            value={ workspace ? workspace.title : '' }
            onChange={ (e) => updateTitle(e.target.value) }
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Description"
            value={ workspace ? workspace.description : '' }
            onChange={ (e) => updateDescription(e.target.value) }
            fullWidth
            variant="outlined"
            multiline
            rows={ 4 }
          />

          <Box sx={ { display: 'flex', gap: 2, marginBottom: 2 } }>
            <Typography
              gutterBottom
              variant="h6"
              align="justify"
            >
              Members
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              value={ newMember }
              onChange={ (e) => setNewMember(e.target.value) }
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={ handleAdd }
            >
              Add
            </Button>
          </Box>
          <List
            sx={ { width: '100%', maxWidth: 360, bgcolor: 'background.paper' } }
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {
              workspace ? (workspace.members.map((member, index) => {
                return (
                  <ListItem key={ index } >
                    <Avatar />
                    { member }
                  </ListItem>
                );
              })) : (<div></div>)
            }
          </List>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Update Workspace
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default WorkspacePage;