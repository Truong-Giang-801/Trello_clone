import { Box, Card, CardContent, Checkbox, FormControlLabel, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const DroppableList = ({ status }) => {

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [tasks, setTasks] = useState({
        expired: [],
        todo: [],
        doing: [],
        done: [],
    });

    const formatDueDate = (dueDate) => {
        const date = new Date(dueDate._seconds * 1000);
        return date.toLocaleDateString('en-US');
    };


    const updateTaskOnServer = async (task) => {
        // try {
        //     await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/tasks/${task.id}`, task);
        // } catch (error) {
        //     console.error('Error updating task on the server:', error);
        // }
    };

    const handleCheckboxChange = async (taskId, isChecked) => {
        try {
            const updatedTasks = { ...tasks };
            let updatedTask;

            for (let status in updatedTasks) {
                const taskIndex = updatedTasks[status].findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    updatedTask = updatedTasks[status][taskIndex];
                    updatedTasks[status].splice(taskIndex, 1);
                    break;
                }
            }

            if (updatedTask) {
                const today = new Date();
                const dueDate = new Date(updatedTask.dueDate._seconds * 1000);

                updatedTask.isCompleted = isChecked;
                if (isChecked) {
                    updatedTask.status = 'Done';
                    updatedTask.statusEnum = 3;
                    updatedTasks.done.push(updatedTask);
                } else {
                    if (dueDate < today) {
                        updatedTask.status = 'Expired';
                        updatedTask.statusEnum = 0;
                        updatedTasks.expired.push(updatedTask);
                    } else {
                        updatedTask.status = 'Todo';
                        updatedTask.statusEnum = 1;
                        updatedTasks.todo.push(updatedTask);
                    }
                }

                setTasks(updatedTasks);
                await updateTaskOnServer(updatedTask);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                for (let status in updatedTasks) {
                    updatedTasks[status] = updatedTasks[status].filter(task => task.id !== taskId);
                }
                return updatedTasks;
            });

            // await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/api/tasks/${taskId}`);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // const filteredTasks = Object.keys(tasks).reduce((acc, status) => {
    //     acc[status] = tasks[status].filter(task => {
    //         const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    //         const matchesFilterStatus = filterStatus === 'all' || task.status === filterStatus;
    //         const matchesFilterPriority = filterPriority === 'all' || task.priority === filterPriority;
    //         return matchesSearch && matchesFilterStatus && matchesFilterPriority;
    //     });
    //     return acc;
    // }, {});

    // const sortedTasks = Object.keys(filteredTasks).reduce((acc, status) => {
    //     acc[status] = filteredTasks[status].sort((a, b) => {
    //         if (sortOrder === 'asc') {
    //             return new Date(a.dueDate._seconds * 1000) - new Date(b.dueDate._seconds * 1000);
    //         } else {
    //             return new Date(b.dueDate._seconds * 1000) - new Date(a.dueDate._seconds * 1000);
    //         }
    //     });
    //     return acc;
    // }, {});

    return (
        <Stack item sx={ { width: 200 } } xs={ 12 } sm={ 6 } md={ 3 } key={ status }>
            <Droppable droppableId={ status }>
                { (provided) => (
                    <Box
                        ref={ provided.innerRef }
                        { ...provided.droppableProps }
                        sx={ {
                            border: '1px solid',
                            // borderColor: columnColors[status].border,
                            borderRadius: 2,
                            padding: 2,
                            // backgroundColor: columnColors[status].background
                        } }
                    >
                        <Typography align="center" variant="h6">
                            { status.charAt(0).toUpperCase() + status.slice(1) }
                        </Typography>
                        { tasks[status].map((task, index) => (
                            <Draggable
                                key={ task.id }
                                draggableId={ task.id }
                                index={ index }
                                isDragDisabled={ status === 'expired' }
                            >
                                { (provided) => (
                                    <Card
                                        ref={ provided.innerRef }
                                        { ...provided.draggableProps }
                                        { ...provided.dragHandleProps }
                                        sx={ {
                                            marginBottom: 1,
                                            boxShadow: 2
                                        } }
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={ { fontWeight: 'bold', fontSize: '1.25rem' } }>
                                                { task.title }
                                            </Typography>
                                            <Typography variant="body2">
                                                { task.description }
                                            </Typography>
                                            <Box sx={ { display: 'flex', justifyContent: 'space-between' } }>
                                                <Typography variant="caption">
                                                    Due: { formatDueDate(task.dueDate) }
                                                </Typography>
                                                <Typography variant="caption">
                                                    Priority: { task.priority }
                                                </Typography>
                                            </Box>
                                            <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={ task.isCompleted }
                                                            onChange={ (e) => handleCheckboxChange(task.id, e.target.checked) }
                                                        />
                                                    }
                                                    label={ task.isCompleted ? 'Completed' : 'Incomplete' }
                                                />
                                                <Box>
                                                    <IconButton
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            setEditingTask(task);
                                                            setShowTaskForm(true);
                                                        } }
                                                    >
                                                        {/* <EditIcon /> */ }
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={ (e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTask(task.id);
                                                        } }
                                                    >
                                                        {/* <DeleteIcon /> */ }
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ) }
                            </Draggable>
                        )) }
                        { provided.placeholder }
                    </Box>
                ) }
            </Droppable>
        </Stack>
    );
};

export default DroppableList;
