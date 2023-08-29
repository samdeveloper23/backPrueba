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
        console.log(username);
        console.log(email);
        console.log(ownername);


        const hashedPass = await bcrypt.hash(password, 10);
        console.log(username);
        await connection.query(
            `INSERT INTO users (role, email, username, ownername, password, createdAt, registrationCode) VALUES($1, $2, $3, $4, $5, $6, $7)`,
            [role, email, username, ownername, hashedPass, new Date(), registrationCode]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = insertUserQuery;
