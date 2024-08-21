const express = require('express');
const { createList, getLists } = require('../controllers/ListsController'); // Vérifiez que ces fonctions existent
const router = express.Router();
const authenticate = require('../middleware/authenticate');

// Vérifiez que `createList` et `getLists` sont bien définis
router.post('/', authenticate, createList);
router.get('/board/:boardId', authenticate, getLists);

module.exports = router;
