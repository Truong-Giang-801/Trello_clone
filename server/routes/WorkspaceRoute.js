const express = require('express');
const workspaceController = require('../controllers/WorkspaceController');

// import WorkspaceController from '../controllers/WorkspaceController.js';

const router = express.Router();

router.post('/', workspaceController.createBoard);

module.exports = router;