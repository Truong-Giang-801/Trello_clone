const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const testRoutes = require('./routes/testRoute');
const boardRoutes = require('./routes/BoardRoute');
const workspaceRoutes = require('./routes/WorkspaceRoute');
const { default: mongoose } = require('mongoose');

mongoose.connect('mongodb+srv://vietlinhg4:5S88GUHWwbz8AHY@cluster0.ewhqtdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

app.use('/api/test', testRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/workspace', workspaceRoutes);

// Start the server
const PORT = process.env.PORT || 5251;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});