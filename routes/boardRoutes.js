const express = require('express');
const { createBoard, getBoards } = require('../controllers/BoardsController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createBoard);
router.get('/team/:teamId', authenticate, getBoards);

module.exports = router;
