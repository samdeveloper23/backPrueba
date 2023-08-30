const getDB = require('../../db/getDB');

const updateUserInfoQuery = async (personalInfo, userId) => {
    let connection;

    try {
        connection = await getDB();

        const query = `
            UPDATE users
            SET personalInfo = $1, modifiedAt = $2
            WHERE id = $3
        `;

        const values = [personalInfo, new Date(), userId];

        await connection.query(query, values);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserInfoQuery;


