const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Remplacer les options invalides par des options correctes
    connectTimeout: 10000, // Timeout pour la connexion
});

// Fonction pour obtenir l'heure actuelle formatée
const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString(); // Format ISO 8601
};

// Fonction pour exécuter une requête de ping
const pingDatabase = () => {
    pool.query('SELECT 1', (err) => {
        const currentTime = getCurrentTime();
        if (err) {
            console.error(`Error pinging the database at [${currentTime}]:`, err);
        } else {
            console.log(`Successfully pinged the database at [${currentTime}]`);
        }
    });
};

// Ping la base de données toutes les 5 minutes
setInterval(pingDatabase, 300000); // 300000 ms = 5 minutes

// Gestion des erreurs et des événements de connexion du pool
pool.on('acquire', (connection) => {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', (connection) => {
    console.log('Connection %d released', connection.threadId);
});

pool.on('enqueue', () => {
    console.log('Waiting for available connection slot');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle connection', err);
    process.exit(-1); // Sortie forcée en cas d'erreur non récupérable
});

// Fonction de reconnexion en cas de perte de connexion
const handleDisconnect = (pool) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error reconnecting to the database:', err);
            setTimeout(() => handleDisconnect(pool), 2000); // Attendre 2 secondes avant de réessayer
        } else {
            if (connection) connection.release();
            console.log('Reconnected to the database');
        }
    });
};

// Surveiller les erreurs de connexion et tenter de reconnecter
pool.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.error('Database connection was closed.', err);
        handleDisconnect(pool);
    } else {
        throw err;
    }
});

module.exports = pool.promise();
