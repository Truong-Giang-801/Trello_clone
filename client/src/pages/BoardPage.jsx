import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import io from 'socket.io-client';

const BoardPage = () => {
    const { boardId } = useParams();
    const auth = getAuth();

    const [lists, setLists] = useState([]);
    const [openCardDialog, setOpenCardDialog] = useState(false);
    const [openListDialog, setOpenListDialog] = useState(false);
    const [newCard, setNewCard] = useState({ title: '', description: '', listId: '' });
    const [newList, setNewList] = useState({ title: '' });
    const [editingList, setEditingList] = useState(null); // nếu khác null thì đang sửa

    useEffect(() => {
        // Kết nối Socket.IO
        const socket = io(`${process.env.REACT_APP_BACKEND_API_URL}`); // Đảm bảo dùng đúng URL server backend
        // Lắng nghe sự kiện 'newList' và cập nhật UI khi có List mới
        socket.on('newList', (newList) => {
            setLists((prevLists) => [...prevLists, { ...newList, cards: [] }]);
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

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser || !boardId) return;

            console.log('Authenticated user:', currentUser.uid);

            try {
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
        });

        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [boardId]);

    const handleCreateCard = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/card`, {
                title: newCard.title,
                description: newCard.description,
                listId: newCard.listId,
            });
            return res.data;
        } catch (err) {
            console.error('Error creating card:', err);
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

    const handleEditList = (listId) => {
        const list = lists.find((l) => l._id === listId);
        if (list) {
            setEditingList(list);
            setNewList({ title: list.title });
            setOpenListDialog(true);
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
            return res.data;
        } catch (err) {
            console.error('Error deleting list:', err);
        }
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId, type } = result;

        if (!destination) return;

        // Kéo thả danh sách
        if (type === 'LIST') {
            const newLists = Array.from(lists);
            const draggedList = newLists.splice(source.index, 1)[0];
            newLists.splice(destination.index, 0, draggedList);

            // Tính toán position mới
            let newPosition = 0;

            if (destination.index === 0) {
                // Đầu tiên
                newPosition = newLists[1]?.position - 1 || 0;
            } else if (destination.index === newLists.length - 1) {
                // Cuối cùng
                newPosition = newLists[newLists.length - 2]?.position + 1 || 0;
            } else {
                const left = newLists[destination.index - 1];
                const right = newLists[destination.index + 1];
                newPosition = (left.position + right.position) / 2;
            }

            // Gửi update vị trí lên backend
            try {
                await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/list/${draggedList._id}`, {
                    position: newPosition
                });
            } catch (err) {
                console.error('Error updating list position:', err);
            }
        }
    };


    return (
        <Box sx={ { padding: 3 } }>
            <DragDropContext onDragEnd={ onDragEnd }>
                {/* Nút tạo List */ }
                <Box sx={ { marginBottom: 2 } }>
                    <Button variant="contained" onClick={ () => setOpenListDialog(true) }>
                        Create New List
                    </Button>
                </Box>

                <Droppable key="board" droppableId="board" direction="horizontal" type="LIST">
                    { (provided) => (
                        <div
                            ref={ provided.innerRef }
                            { ...provided.droppableProps }
                            style={ { display: 'flex', overflowX: 'auto', paddingBottom: 16 } }
                        >
                            { lists.map((list, listIndex) => (
                                <Draggable key={ list._id } draggableId={ list._id } index={ listIndex }>
                                    { (listProvided) => (
                                        <div
                                            ref={ listProvided.innerRef }
                                            { ...listProvided.draggableProps }
                                            style={ {
                                                ...listProvided.draggableProps.style,
                                                width: 300,
                                                marginRight: 16,
                                                flexShrink: 0,
                                            } }
                                        >
                                            <Box { ...listProvided.dragHandleProps }>
                                                {/* List header */ }
                                                <Typography variant="h6" sx={ { bgcolor: 'primary.main', color: 'white', textAlign: 'center', py: 1 } }>
                                                    <IconButton
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            handleEditList(list._id);
                                                        } }
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    { list.title }
                                                    <IconButton color="error"
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            handleDeleteList(list._id);
                                                        } }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>

                                                </Typography>

                                            </Box>

                                            {/* List content and cards */ }
                                            <Droppable droppableId={ list._id } type="CARD">
                                                { (provided) => (
                                                    <Box
                                                        ref={ provided.innerRef }
                                                        { ...provided.droppableProps }
                                                        sx={ {
                                                            border: '1px solid',
                                                            borderColor: 'grey.400',
                                                            borderRadius: 2,
                                                            p: 2,
                                                            minHeight: 200,
                                                            backgroundColor: 'grey.100',
                                                        } }
                                                    >


                                                        { list.cards.map((card, index) => (
                                                            <Draggable draggableId={ card._id } index={ index } key={ card._id }>
                                                                { (provided) => (
                                                                    <Card
                                                                        ref={ provided.innerRef }
                                                                        { ...provided.draggableProps }
                                                                        { ...provided.dragHandleProps }
                                                                        sx={ { mb: 2 } }
                                                                    >
                                                                        <CardContent>
                                                                            <Typography variant="subtitle1">{ card.title }</Typography>
                                                                            <Typography variant="caption">
                                                                                Deadline: { formatDueDate(card.dueDate) }
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </Card>
                                                                ) }
                                                            </Draggable>
                                                        )) }
                                                        <Button
                                                            fullWidth
                                                            variant="contained"
                                                            sx={ { mb: 2 } }
                                                            onClick={ () => {
                                                                setNewCard({ ...newCard, listId: list._id });
                                                                setOpenCardDialog(true);
                                                            } }
                                                        >
                                                            Add Card
                                                        </Button>
                                                        { provided.placeholder }
                                                    </Box>
                                                ) }
                                            </Droppable>
                                        </div>
                                    ) }
                                </Draggable>
                            )) }
                            { provided.placeholder }
                        </div>
                    ) }
                </Droppable>

            </DragDropContext>

            {/* Dialog tạo List */ }
            <Dialog open={ openListDialog } onClose={ () => setOpenListDialog(false) }>
                <DialogTitle>{ editingList ? 'Edit List' : 'Create New List' }</DialogTitle>
                <DialogContent>
                    <TextField
                        label="List Title"
                        variant="outlined"
                        fullWidth
                        value={ newList.title }
                        onChange={ (e) => setNewList({ ...newList, title: e.target.value }) }
                    />

                    <Box sx={ { marginTop: 2, display: 'flex', gap: 1 } }>
                        <Button variant="contained" onClick={ editingList ? handleUpdateList : handleCreateList }>
                            { editingList ? 'Update List' : 'Create List' }
                        </Button>
                        { editingList && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={ () => {
                                    setEditingList(null);
                                    setNewList({ title: '' });
                                    setOpenListDialog(false);
                                } }
                            >
                                Cancel
                            </Button>
                        ) }
                    </Box>

                </DialogContent>
            </Dialog>

            {/* Dialog tạo Card */ }
            <Dialog open={ openCardDialog } onClose={ () => setOpenCardDialog(false) }>
                <DialogTitle>Create New Card</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Card Title"
                        variant="outlined"
                        fullWidth
                        value={ newCard.title }
                        onChange={ (e) => setNewCard({ ...newCard, title: e.target.value }) }
                        sx={ { marginBottom: 2 } }
                    />
                    <TextField
                        label="Card Description"
                        variant="outlined"
                        fullWidth
                        value={ newCard.description }
                        onChange={ (e) => setNewCard({ ...newCard, description: e.target.value }) }
                        sx={ { marginBottom: 2 } }
                    />
                    <Box sx={ { marginTop: 2 } }>
                        <Button variant="contained" onClick={ handleCreateCard }>
                            Create Card
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BoardPage;
