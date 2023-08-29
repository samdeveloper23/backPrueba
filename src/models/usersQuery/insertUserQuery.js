const getDB = require('../../db/getDB');

const bcrypt = require('bcrypt');

const { generateError } = require('../../services/errors');

const insertUserQuery = async (
    email,
    username,
    ownername,
    password,
    role,
    registrationCode
) => {
    let connection;

    try {
        connection = await getDB();
        console.log(email);
        let [users] = await connection.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (users.length > 0) {
            generateError('Ya existe un usuario con ese email', 403);
        }

        [users] = await connection.query(
            `SELECT id FROM users WHERE username = $1`,
            [username]
        );

        if (users.length > 0) {
            generateError('Nombre de usuario no disponible', 403);
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await connection.query(
            `INSERT INTO users (role, email, username, ownername, password, createdAt, registrationCode) VALUES($1, $2, $3, $4, $5, $6, $7)`,
            [role, email, username, ownername, hashedPass, new Date(), registrationCode]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
