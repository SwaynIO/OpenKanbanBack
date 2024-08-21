const pool = require('../db');

exports.createBoard = async (req, res) => {
    const { name, teamId } = req.body;

    try {
        const [result] = await pool.query("INSERT INTO boards (name, team_id) VALUES (?, ?)", [name, teamId]);
        if (result.affectedRows > 0) {
            res.status(201).json({ boardId: result.insertId });
        } else {
            res.status(500).json({ message: 'Board creation failed' });
        }
    } catch (error) {
        console.error('Error during board creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getBoards = async (req, res) => {
    const teamId = req.params.teamId;

    try {
        const [boards] = await pool.query("SELECT * FROM boards WHERE team_id = ?", [teamId]);
        res.status(200).json(boards);
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
