const pool = require('../db');

exports.createList = async (req, res) => {
    const { name, boardId, position } = req.body;

    if (!name || !boardId || position == null) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const [boards] = await pool.query("SELECT id FROM boards WHERE id = ?", [boardId]);
        if (boards.length === 0) {
            return res.status(400).json({ message: "Board ID does not exist" });
        }

        const [result] = await pool.query("INSERT INTO lists (name, board_id, position) VALUES (?, ?, ?)", [name, boardId, position]);
        if (result.affectedRows > 0) {
            res.status(201).json({ listId: result.insertId });
        } else {
            res.status(500).json({ message: 'List creation failed' });
        }
    } catch (error) {
        console.error('Error during list creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getLists = async (req, res) => {
    const boardId = req.params.boardId;

    try {
        const [lists] = await pool.query("SELECT * FROM lists WHERE board_id = ?", [boardId]);
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
