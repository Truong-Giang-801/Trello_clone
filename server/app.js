import express from 'express';
import bodyParser from 'body-parser';  // Change to import
import cors from 'cors';
import mongoose from 'mongoose';  // Change to import
import boardRoutes from './routes/BoardRoute.js';  // Add .js extension
import workspaceRoutes from './routes/WorkspaceRoute.js';  // Add .js extension

const app = express();
const testRoutes = require('./routes/testRoute');
const boardRoutes = require('./routes/BoardRoute');
const workspaceRoutes = require('./routes/WorkspaceRoute');
const cardRoutes = require('./routes/cardRoute');
const listRoutes = require('./routes/listRoute')
const { default: mongoose } = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vietlinhg4:5S88GUHWwbz8AHY@cluster0.ewhqtdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Define routes
app.use('/api/board', boardRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/list', listRoutes);

// Start the server
const PORT = process.env.PORT || 5251;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
