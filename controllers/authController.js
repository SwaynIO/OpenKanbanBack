const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        const [result] = await pool.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        if (result.affectedRows > 0) {
            const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ token });
        } else {
            res.status(500).json({ message: 'User registration failed' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (rows.length === 0) return res.status(400).send('User not found');

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.logout = (req, res) => {
    res.send('User logged out');
};
