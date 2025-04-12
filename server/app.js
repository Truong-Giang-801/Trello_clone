const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Start the server
const PORT = process.env.PORT || 5251;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});