const pool = require('../db');

exports.createComment = async (req, res) => {
    const { taskId, content } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await pool.query(
            "INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)",
            [taskId, userId, content]
        );
        if (result.affectedRows > 0) {
            res.status(201).json({ commentId: result.insertId });
        } else {
            res.status(500).json({ message: 'Comment creation failed' });
        }
    } catch (error) {
        console.error('Error during comment creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
