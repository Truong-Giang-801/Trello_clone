import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PeopleIcon from '@mui/icons-material/People';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import io from 'socket.io-client';

const BoardPage = () => {
  const { boardId } = useParams();
  const auth = getAuth();
  const currentUser = auth.currentUser;


  const [isMember, setIsMemBer] = useState(false);
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [openListDialog, setOpenListDialog] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', dueDate: '', listId: '' });
  const [newList, setNewList] = useState({ title: '' });
  const [editingList, setEditingList] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  // Add these new state variables for edit functionality
  const [editingListId, setEditingListId] = useState(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState(false);

  const [openDueDateDialog, setOpenDueDateDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    // Kết nối Socket.IO
    const socket = io(`${process.env.REACT_APP_BACKEND_API_URL}`); // Đảm bảo dùng đúng URL server backend
    // Lắng nghe sự kiện 'newList' và cập nhật UI khi có List mới
    socket.on('newList', (newList) => {
      setLists((prevLists) => [...prevLists, {...newList, cards: []}]);
      setOpenListDialog(false);
    });

    // Lắng nghe sự kiện 'newCard' và cập nhật UI khi có Card mới
    socket.on('newCard', (newCard) => {
      setLists((prevLists) => {
        return prevLists.map((list) => {
          if (list._id === newCard.listId) {
            return { ...list, cards: [...list.cards, newCard] };
          }
          return list;
        });
      });
    });
    // Handle assigning a user to a card
    socket.on('assignUser', ({ cardId, userId }) => {
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card._id === cardId
              ? { ...card, assignMember: [...(card.assignMember || []), userId] }
              : card
          ),
        }))
      );
    });

    // Handle unassigning a user from a card
    socket.on('unassignUser', ({ cardId, userId }) => {
      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card._id === cardId
              ? { ...card, assignMember: card.assignMember.filter((id) => id !== userId) }
              : card
          ),
        }))
      );
    });
    socket.on('updateCard', (updatedCard) => {
      setLists((prevLists) => {
        // First, we need to identify if this card has moved to a different list
        // by checking if it exists in a list that's different from updatedCard.listId
        
        // Find which list (if any) currently contains this card
        const sourceList = prevLists.find(list => 
          list.cards.some(card => card._id === updatedCard._id && list._id !== updatedCard.listId)
        );
        
        // If card has moved between lists
        if (sourceList) {
          return prevLists.map(list => {
            // Remove from source list
            if (list._id === sourceList._id) {
              return {
                ...list,
                cards: list.cards.filter(card => card._id !== updatedCard._id)
              };
            }
            // Add to destination list
            else if (list._id === updatedCard.listId) {
              // Add the card and sort by position
              const updatedCards = [...list.cards, updatedCard].sort((a, b) => a.position - b.position);
              return {
                ...list,
                cards: updatedCards
              };
            }
            // Other lists remain unchanged
            return list;
          });
        } 
        // If card stays in the same list (position update only)
        else {
          return prevLists.map(list => {
            if (list._id === updatedCard.listId) {
              // Update the card and ensure cards remain sorted by position
              const updatedCards = list.cards
                .map(card => card._id === updatedCard._id ? updatedCard : card)
                .sort((a, b) => a.position - b.position);
              
              return {
                ...list,
                cards: updatedCards
              };
            }
            return list;
          });
        }
      });
    });
    
    socket.on('deleteCard', ({ cardId, listId }) => {
      setLists((prevLists) => {
        return prevLists.map((list) => {
          if (list._id === listId) {
            return {
              ...list,
              cards: list.cards.filter((card) => card._id !== cardId)
            };
          }
          return list;
        });
      });
    });
    socket.on('updateList', (updatedList) => {
      setLists((prev) =>
          [...prev.map((list) =>
            list._id === updatedList._id ? { ...updatedList, cards: list.cards } : list
          )].sort((a, b) => a.position - b.position)
        );
        
    });
    
    socket.on('deleteList', ({ listId }) => {
      setLists((prev) => prev.filter((list) => list._id !== listId));
    });

    const fetchBoard = async () => {
      try {
        const boardRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/board/${boardId}`);
        const workspaceRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/workspace/${boardRes.data.workspaceId}`);
        setBoard({...boardRes.data, memberIds: workspaceRes.data.members});
        const listRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/board/${boardId}`);
        const lists = listRes.data;

        const listWithCards = await Promise.all(
            lists.map(async (list) => {
                try {
                    const cardRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/list/${list._id}`);
                    return { ...list, cards: cardRes.data || [] };
                } catch (err) {
                    console.error(`Error fetching cards for list ${list._id}`, err);
                    return { ...list, cards: [] };
                }
            })
        );

        setLists(listWithCards);
        console.log('Fetched lists + cards:', listWithCards);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchBoard()
      
    

    return () => {
      socket.disconnect();
    }
  }, [boardId]);

  // Add this effect to fetch board members
  useEffect(() => {
    if (!board) return; // Wait until the board is loaded

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      try {
        console.log('Current user:', currentUser);
        console.log('Board:', board);

        // Fetch the workspace associated with the board to get the ownerId
        const workspaceRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/workspace/${board.workspaceId}`);
        const workspaceOwnerId = workspaceRes.data.ownerId;

        // Check if the current user is the owner of the workspace
        const isCurrentUserOwner = workspaceOwnerId === currentUser.uid;

        // Fetch board members
        if (board.memberIds && board.memberIds.length > 0) {
          try {
            const memberPromises = board.memberIds.map((userId) =>
              axios.get(`http://localhost:5277/api/Users/email/${userId}`)
            );

            const responses = await Promise.all(memberPromises);
            const fetchedMembers = responses.map((res) => res.data);
            setBoardMembers(fetchedMembers);

            // Check if the current user is a member of the board
            const isCurrentUserMember = fetchedMembers.some((member) => member._id === currentUser.uid);
            setIsMemBer(isCurrentUserMember || isCurrentUserOwner); // User is a member if they are either a member or the owner
          } catch (err) {
            console.error('Error fetching board members:', err);
          }
        } else {
          // If no members, only the owner can access
          setIsMemBer(isCurrentUserOwner);
        }
      } catch (err) {
        console.error('Error fetching current user, workspace, or board members:', err);
      }
    });

    return () => unsubscribe();
  }, [board]);

  const handleCreateCard = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/card`, {
        title: newCard.title,
        dueDate: newCard.dueDate,
        listId: newCard.listId,
      });
      setOpenCardDialog(false);
      setNewCard({ title: '', dueDate: '', listId: '' });
    } catch (err) {
      console.error('Error creating card:', err);
    }
  };

  // Add this function to handle saving the card title edit
  const handleCardTitleSave = async (cardId, newTitle) => {
    try {
      if (!newTitle.trim()) {
        // Don't save empty titles
        setEditingCardId(null);
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/${cardId}`, {
        title: newTitle
      });
      
      // The socket will handle the UI update
      
      // Exit edit mode
      setEditingCardId(null);
    } catch (err) {
      console.error('Error updating card title:', err);
    }
  };

  // Add this function to handle saving the list title edit
  const handleListTitleSave = async (listId, newTitle) => {
    try {
      if (!newTitle.trim()) {
        // Don't save empty titles
        setEditingListId(null);
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/${listId}`, {
        title: newTitle
      });
      
      // Update UI immediately (socket will handle final update)
      setLists(prevLists => 
        prevLists.map(list => 
          list._id === listId ? { ...list, title: newTitle } : list
        )
      );
      
      // Exit edit mode
      setEditingListId(null);
    } catch (err) {
      console.error('Error updating list title:', err);
    }
  };

  const handleCreateList = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/list`, {
        title: newList.title,
        boardId,
        position: lists.length > 0 ? lists[lists.length - 1].position + 1 : 0
      });
      return res.data;
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const handleUpdateList = async () => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/${editingList._id}`, {
        title: newList.title,
      });

      // Cập nhật UI
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === editingList._id ? { ...list, title: newList.title } : list
        )
      );

      setEditingList(null);
      setNewList({ title: '' });
      setOpenListDialog(false);
      return res.data;

    } catch (err) {
      console.error('Error updating list:', err);
    }
  };

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US');
  };

  const handleDeleteList = async (listId) => {
    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/${listId}`);
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  // Update the card with new due date
  const handleUpdateDueDate = async () => {
    try {
      if (!currentCard) return;
      
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/${currentCard._id}`, {
        dueDate: currentCard.dueDate
      });
      
      // Update UI
      setLists(prevLists => 
        prevLists.map(list => ({
          ...list,
          cards: list.cards.map(card => 
            card._id === currentCard._id ? { ...card, dueDate: currentCard.dueDate } : card
          )
        }))
      );
      
      setOpenDueDateDialog(false);
    } catch (err) {
      console.error('Error updating due date:', err);
    }
  };

  // Assign user to card
  const handleAssignUser = async () => {
    try {
      if (!currentCard || !selectedUserId) return;
      
      await axios.patch(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/${currentCard._id}/assign`, {
        userId: selectedUserId
      });
      
      // Fetch updated assigned members
      await fetchAssignedMembers(currentCard._id);
      
      setSelectedUserId('');
    } catch (err) {
      console.error('Error assigning user to card:', err);
    }
  };

  // Fetch assigned members for a card
  const fetchAssignedMembers = async (cardId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/${cardId}`);
      const card = res.data;
      console.log(card);
      if (card.assignMember && card.assignMember.length > 0) {
        const assignedUsersRes = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/users/multiple`, {
          params: { userIds: card.assignMember.join(',') }
        });
        setAssignedMembers(assignedUsersRes.data);
      } else {
        setAssignedMembers([]);
      }
    } catch (err) {
      console.error('Error fetching assigned members:', err);
    }
  };

  // Delete card
  const handleDeleteCard = async (cardId, listId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/api/card/${cardId}`);
      
      // Update UI
      setLists(prevLists => 
        prevLists.map(list => {
          if (list._id === listId) {
            return {
              ...list,
              cards: list.cards.filter(card => card._id !== cardId)
            };
          }
          return list;
        })
      );
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, type } = result;
  
    if (!destination) return;
    if (!currentUser) {
      alert('You must be logged in to modify this board.');
      return;

    }
    if (!isMember) {
      alert('You must be a member of this board to modify it.');
      return;
    }
  
    if (type === 'LIST') {
      const newLists = Array.from(lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);
  
      // Cập nhật UI ngay lập tức
      setLists(newLists);
  
      // Tính toán lại position
      let newPosition = 0;
      if (destination.index === 0) {
        newPosition = newLists[1]?.position - 1 || 0;
      } else if (destination.index === newLists.length - 1) {
        newPosition = newLists[newLists.length - 2]?.position + 1 || 0;
      } else {
        const left = newLists[destination.index - 1];
        const right = newLists[destination.index + 1];
        newPosition = (left.position + right.position) / 2;
      }
  
      // Gửi cập nhật lên server
      try {
        await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/${movedList._id}`, {
          position: newPosition
        });
      } catch (err) {
        console.error('Error updating list position:', err);
      }
    }
    // Handle card reordering or moving between lists
    if (type === 'CARD') {
      const sourceList = lists.find(list => list._id === source.droppableId);
      const destList = lists.find(list => list._id === destination.droppableId);
      
      if (!sourceList || !destList) return;
      
      // Create new lists array to update UI immediately
      const newLists = [...lists];
      
      // Find the source and destination lists in our newLists array
      const newSourceList = newLists.find(list => list._id === source.droppableId);
      const newDestList = newLists.find(list => list._id === destination.droppableId);
      
      // Get the card being moved
      const movedCard = {...sourceList.cards[source.index]};
      
      // Remove from source list
      newSourceList.cards.splice(source.index, 1);
      
      // Add to destination list (could be the same list for reordering)
      newDestList.cards.splice(destination.index, 0, movedCard);
      
      // Update UI immediately
      setLists(newLists);
      
      // Calculate new position
      let newPosition = 0;
      
      // If moving to an empty list or to the beginning of a list
      if (destination.index === 0) {
        newPosition = (newDestList.cards[1]?.position || 1000) - 100;
      } 
      // If moving to the end of a list
      else if (destination.index === newDestList.cards.length - 1) {
        newPosition = (newDestList.cards[destination.index - 1]?.position || 0) + 100;
      } 
      // If moving between two cards
      else {
        const prevCard = newDestList.cards[destination.index - 1];
        const nextCard = newDestList.cards[destination.index + 1];
        newPosition = (prevCard.position + nextCard.position) / 2;
      }
      
      // Prepare card update data
      const cardUpdate = {
        position: newPosition
      };
      
      // If moving between lists, update the listId too
      if (source.droppableId !== destination.droppableId) {
        cardUpdate.listId = destination.droppableId;
      }
      
      // Send update to server
      try {
        const updatedCard = await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/card/${movedCard._id}`, 
          cardUpdate
        );
        
        // Note: If your server emits a socket event for card updates,
        // you don't need to manually update the UI here, as the socket
        // listener will handle it
      } catch (err) {
        console.error('Error updating card position:', err);
        
        // Revert UI changes if server update fails
        setLists([...lists]);
      }
    }
  };

  const getBorderColor = (dueDate) => {
    if (!dueDate) return 'green';
  
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00 today
    const due = new Date(dueDate);
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  
    const diffInMs = dueDay - today;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    if (diffInDays < 0) return 'red';
    if (diffInDays === 0) return 'orange';
    if (diffInDays <= 2) return 'yellow';
    return 'green';
  };

  return (
    <Box sx={{ padding: 3, minHeight: '618px'}}>
      {board != null && (
        // Click-to-edit Board Title
        <Box sx={{ borderRadius: '10px', bgcolor: 'primary.main', color: 'white', textAlign: 'center', py: 1, marginBottom: '0.5em' }}>
          <Typography 
            variant="h3" 
            onClick={() => setEditingBoardTitle(true)}
            sx={{ cursor: currentUser && isMember ? 'pointer' : 'default' }}
          >
            {board.title}
          </Typography>
        </Box>
      )}
      
      <DragDropContext  onDragEnd={onDragEnd}>
        {/* Nút tạo List */}
        <Box sx={{ marginBottom: 2 }}>
          <Button variant="contained" onClick={() => setOpenListDialog(true)} disabled={!currentUser  || !isMember}>
            Create New List
          </Button>
        </Box>
        {lists.length > 0 && (
          <Droppable droppableId="board" direction="horizontal" type="LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', overflowX: 'auto', paddingBottom: 16 }}
              >
                {lists.map((list, listIndex) => (
                  <Draggable key={list._id} draggableId={list._id} index={listIndex}>
                    {(listProvided) => (
                      <div
                        ref={listProvided.innerRef}
                        {...listProvided.draggableProps}
                        style={{
                          ...listProvided.draggableProps.style,
                          width: 300,
                          marginRight: 16,
                          flexShrink: 0,
                        }}
                      >
                        <Box {...listProvided.dragHandleProps}>
                          {/* List header with click-to-edit */}
                          <Box sx={{ borderRadius: '5px', bgcolor: '#0093cb', color: 'white', textAlign: 'center', py: 1 }}>
                            {editingListId === list._id ? (
                              <TextField
                                autoFocus
                                value={list.title}
                                variant="standard"
                                InputProps={{
                                  sx: { 
                                    color: 'white', 
                                    fontSize: '1.25rem',
                                    textAlign: 'center',
                                    width: '70%'  // Allow space for icons
                                  }
                                }}
                                onChange={(e) => {
                                  // Update the list title locally while editing
                                  setLists(prevLists => 
                                    prevLists.map(l => 
                                      l._id === list._id ? { ...l, title: e.target.value } : l
                                    )
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleListTitleSave(list._id, list.title);
                                  } else if (e.key === 'Escape') {
                                    setEditingListId(null);
                                  }
                                }}
                                onBlur={() => handleListTitleSave(list._id, list.title)}
                              />
                            ) : (
                              <>
                                <Typography 
                                  variant="h6" 
                                  component="span"
                                  onClick={() => setEditingListId(list._id)}
                                  sx={{ cursor: currentUser  & isMember ? 'pointer' : 'default', display: 'inline-block' }}
                                >
                                  {list.title}
                                </Typography>
                              </>
                            )}
                          </Box>
                        </Box>

                        {/* List content and cards */}
                        <Droppable droppableId={list._id} type="CARD" direction="vertical">
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{
                                border: '1px solid',
                                borderColor: 'grey.400',
                                borderRadius: 2,
                                p: 2,
                                minHeight: 200,
                                backgroundColor: 'grey.100',
                              }}
                            >
                              {list.cards.map((card, index) => (
                                <Draggable draggableId={card._id} index={index} key={card._id}>
                                  {(provided) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{ 
                                        mb: 2, 
                                        border: `2px solid ${getBorderColor(card.dueDate)}`,
                                        borderRadius: 2
                                      }}
                                    >
                                      <CardContent>
                                        {editingCardId === card._id ? (
                                          <TextField
                                            autoFocus
                                            fullWidth
                                            value={card.title}
                                            variant="standard"
                                            sx={{ mb: 1 }}
                                            onChange={(e) => {
                                              // Update the card title locally while editing
                                              setLists(prevLists => 
                                                prevLists.map(l => ({
                                                  ...l,
                                                  cards: l.cards.map(c => 
                                                    c._id === card._id ? { ...c, title: e.target.value } : c
                                                  )
                                                }))
                                              );
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') {
                                                handleCardTitleSave(card._id, card.title);
                                              } else if (e.key === 'Escape') {
                                                setEditingCardId(null);
                                              }
                                            }}
                                            onBlur={() => handleCardTitleSave(card._id, card.title)}
                                          />
                                        ) : (
                                          <Typography 
                                            variant="subtitle1" 
                                            onClick={() => setEditingCardId(card._id)}
                                            sx={{ cursor: currentUser  & isMember ? 'pointer' : 'default' }}
                                          >
                                            {card.title}
                                          </Typography>
                                        )}
                                        <Typography variant="caption">
                                          Deadline: {formatDueDate(card.dueDate)}
                                        </Typography>
                                      </CardContent>
                                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'right' }}>
                                        <Box>
                                          <IconButton 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCurrentCard(card);
                                              setOpenDueDateDialog(true);
                                            }}
                                            disabled={!currentUser  || !isMember}
                                          >
                                            <AccessTimeFilledIcon />
                                          </IconButton>
                                          <IconButton 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setCurrentCard(card);
                                              fetchAssignedMembers(card._id);
                                              setOpenAssignDialog(true);
                                            }}
                                            disabled={!currentUser  || !isMember}
                                          >
                                            <PeopleIcon />
                                          </IconButton>
                                          <IconButton color="error"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteCard(card._id, list._id);
                                            }}
                                            disabled={!currentUser  || !isMember}
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                              <Button
                                fullWidth
                                variant="contained"
                                sx={{ mb: 2, bgcolor: '#0093cb' }}
                                onClick={() => {
                                  setNewCard({ ...newCard, listId: list._id });
                                  setOpenCardDialog(true);
                                }}
                                disabled={!currentUser  || !isMember}
                              >
                                Add Card
                              </Button>
                              {provided.placeholder}
                              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteList(list._id);
                                  }}
                                  disabled={!currentUser  || !isMember}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </DragDropContext>

      {/* Dialog tạo List */}
      <Dialog open={openListDialog} onClose={() => setOpenListDialog(false)}>
      <DialogTitle>{editingList ? 'Edit List' : 'Create New List'}</DialogTitle>
        <DialogContent>
          <TextField
            label="List Title"
            variant="outlined"
            fullWidth
            value={newList.title}
            onChange={(e) => setNewList({ ...newList, title: e.target.value })}
          />

          <Box sx={{ marginTop: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={editingList ? handleUpdateList : handleCreateList}>
              {editingList ? 'Update List' : 'Create List'}
            </Button>
            {editingList && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditingList(null);
                  setNewList({ title: '' });
                  setOpenListDialog(false);
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog tạo Card */}
      <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)}>
        <DialogTitle>Create New Card</DialogTitle>
        <DialogContent>
          <TextField
            label="Card Title"
            variant="outlined"
            fullWidth
            value={newCard.title}
            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newCard.dueDate}
            onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" onClick={handleCreateCard}>
              Create Card
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog for updating due date */}
      <Dialog open={openDueDateDialog} onClose={() => setOpenDueDateDialog(false)}>
        <DialogTitle>Update Due Date</DialogTitle>
        <DialogContent>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={currentCard?.dueDate?.split('T')[0] || ''}
            onChange={(e) => setCurrentCard({ ...currentCard, dueDate: e.target.value })}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" onClick={handleUpdateDueDate}>
              Update Due Date
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog for assigning members */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle>Assign Members</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 2, marginTop: 1 }}>
            <Typography variant="subtitle1">Currently Assigned:</Typography>
            {assignedMembers.length > 0 ? (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {assignedMembers.map(member => (
                  <Box 
                    key={member._id} 
                    sx={{ 
                      padding: '4px 8px', 
                      bgcolor: 'primary.light', 
                      color: 'white', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {member.name || member.email}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">No members assigned</Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <Select
                labelId="member-select-label"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                displayEmpty
                sx={{ 
                  '& .MuiSelect-select': { 
                    padding: '10px 14px',
                  } 
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select a member</em>
                </MenuItem>
                {boardMembers.map((member) => (
                  <MenuItem key={member.uid} value={member.uid}>
                    {member.name || member.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              onClick={handleAssignUser}
              disabled={!selectedUserId}
            >
              Assign
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BoardPage;