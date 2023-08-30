const getDB = require('../../db/getDB');

const updateUserPlaceQuery = async (place, userId) => {
    let connection;

    try {
        connection = await getDB();

        const query = `
            UPDATE users
            SET place = $1, modifiedAt = $2
            WHERE id = $3
        `;

        const values = [place, new Date(), userId];

        await connection.query(query, values);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = updateUserPlaceQuery;


