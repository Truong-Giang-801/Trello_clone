// const { TestModel } = require('../models/TaskModel');

export async function createBoard(req, res) {
    try {
        const test = {
            data: "data"
        }
        res.json(test);
    } catch (error) {
        console.error('Error fetching:', error);
        res.status(500).send('Internal server error');
    }
}