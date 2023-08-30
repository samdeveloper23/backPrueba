const getDB = require('../../db/getDB');
const { generateError } = require('../../services/errors');

const selectAllUsersQuery = async (keyword = '') => {
    let connection;

    try {
        connection = await getDB();

        const query = `
            SELECT 
                id, 
                username, 
                email, 
                role, 
                avatar,
                place,
                personalInfo
            FROM users 
            WHERE username ILIKE $1 OR role ILIKE $2 OR place ILIKE $3
        `;

        const values = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];

        const { rows: users } = await connection.query(query, values);

        // Si no hay usuarios, lanzamos un error.
        if (users.length < 1) {
            generateError(
                'Todavía no hay usuarios. ¡Regístrate y sé el primero!',
                404
            );
        }

        return users;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectAllUsersQuery;

