const pool = require('../db');

exports.createTask = async (req, res) => {
    const { name, description, listId, assignedTo, position, dueDate } = req.body;

    try {
        const [result] = await pool.query("INSERT INTO tasks (name, description, list_id, assigned_to, position, due_date) VALUES (?, ?, ?, ?, ?, ?)", [name, description, listId, assignedTo, position, dueDate]);
        if (result.affectedRows > 0) {
            res.status(201).json({ taskId: result.insertId });
        } else {
            res.status(500).json({ message: 'Task creation failed' });
        }
    } catch (error) {
        console.error('Error during task creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    const listId = req.params.listId;

    try {
        const [tasks] = await pool.query("SELECT * FROM tasks WHERE list_id = ?", [listId]);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.updateTaskPosition = async (req, res) => {
    const { taskId, position } = req.body;
    console.log('Received update request:', { taskId, position });

    try {
        const [result] = await pool.query(
            "UPDATE tasks SET position = ? WHERE id = ?",
            [position, taskId]
        );

        console.log('Update result:', result);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Task position updated successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error updating task position:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


exports.getTaskDetails = async (req, res) => {
    const taskId = req.params.taskId;

    try {
        const [taskDetails] = await pool.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
        if (taskDetails.length > 0) {
            const [comments] = await pool.query("SELECT c.*, u.username FROM comments c INNER JOIN users u ON c.user_id = u.id WHERE c.task_id = ?", [taskId]);
            res.status(200).json({ task: taskDetails[0], comments });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};