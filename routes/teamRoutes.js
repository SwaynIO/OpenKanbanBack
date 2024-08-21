const express = require('express');
const { createTeam, getTeams } = require('../controllers/TeamsController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createTeam);
router.get('/', authenticate, getTeams);

module.exports = router;
