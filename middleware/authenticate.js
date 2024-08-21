const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attache les informations de l'utilisateur à la requête
        next();
    } catch (error) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

module.exports = authenticate;
