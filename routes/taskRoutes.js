const express = require('express');
const { createTask, getTasks, updateTaskPosition, getTaskDetails } = require('../controllers/TasksController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createTask);
router.get('/list/:listId', authenticate, getTasks);
router.put('/position', authenticate, updateTaskPosition);
router.get('/:taskId', authenticate, getTaskDetails);

module.exports = router;
