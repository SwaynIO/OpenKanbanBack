const express = require('express');
const { createComment } = require('../controllers/CommentsController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createComment);

module.exports = router;
