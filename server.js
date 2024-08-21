const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes'); // Import des routes des équipes
const boardRoutes = require('./routes/boardRoutes'); // Import des routes des tableaux
const listRoutes = require('./routes/listRoutes'); // Import des routes des listes
const taskRoutes = require('./routes/taskRoutes'); // Import des routes des tâches
const commentRoutes = require('./routes/commentRoutes');
const authenticate = require('./middleware/authenticate'); // Middleware d'authentification

dotenv.config();
const app = express();

// Configurer CORS
app.use(cors({
    origin: 'http://localhost:8080', // Autoriser uniquement les requêtes provenant de localhost:8080
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous utilisez des cookies, sessions, etc.
}));

app.use(express.json());

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes pour les équipes
app.use('/api/teams', authenticate, teamRoutes);

// Routes pour les tableaux
app.use('/api/boards', authenticate, boardRoutes);

// Routes pour les listes
app.use('/api/lists', authenticate, listRoutes);

// Routes pour les tâches
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/comments', authenticate, commentRoutes); // Utilisation de la route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
