const getDB = require('../db/getDB');
const { generateError } = require('../services/errors');

const userExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const query = `
            SELECT id FROM users WHERE id = $1;
        `;
        const values = [req.user.id];

        const result = await connection.query(query, values);
        const users = result.rows;

        if (users.length < 1) {
            generateError('Usuario no encontrado', 404);
        }

        next();
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = userExists;

