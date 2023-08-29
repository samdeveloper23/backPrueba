const getDB = require('../../db/getDB');
const bcrypt = require('bcrypt');
const { generateError } = require('../../services/errors');

const upDateUsersPassQuery = async (currentPass, newPass, userId) => {
    let connection;

    try {
        connection = await getDB();

        const [users] = await connection.query(
            `SELECT password FROM users WHERE id = $1`,
            [userId]
        );

        const validPass = await bcrypt.compare(currentPass, users[0].password);

        if (!validPass) {
            generateError('Contraseña actual incorrecta', 401);
        }

        const hashedPass = await bcrypt.hash(newPass, 10);

        const query = `
            UPDATE users
            SET password = $1, modifiedAt = $2
            WHERE id = $3
        `;

        const values = [hashedPass, new Date(), userId];

        await connection.query(query, values);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = upDateUsersPassQuery;
