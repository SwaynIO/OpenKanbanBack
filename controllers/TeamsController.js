const pool = require('../db');

exports.createTeam = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.id; // Récupère l'ID de l'utilisateur à partir du token

    try {
        const [result] = await pool.query("INSERT INTO teams (name, description) VALUES (?, ?)", [name, description]);
        if (result.affectedRows > 0) {
            const teamId = result.insertId;
            await pool.query("INSERT INTO team_members (user_id, team_id, role) VALUES (?, ?, 'admin')", [userId, teamId]);
            res.status(201).json({ teamId });
        } else {
            res.status(500).json({ message: 'Team creation failed' });
        }
    } catch (error) {
        console.error('Error during team creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.getTeams = async (req, res) => {
    const userId = req.user.id;

    try {
        const [teams] = await pool.query("SELECT t.* FROM teams t INNER JOIN team_members tm ON t.id = tm.team_id WHERE tm.user_id = ?", [userId]);
        res.status(200).json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
