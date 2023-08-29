const getDB = require('../../db/getDB');

const updateUserRecoverPassQuery = async (email, recoverPassCode) => {
  let connection;

  try {
    connection = await getDB();

    const query = `
            UPDATE users
            SET recoverPassCode = $1, modifiedAt = $2
            WHERE email = $3
        `;

    const values = [recoverPassCode, new Date(), email];

    await connection.query(query, values);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserRecoverPassQuery;

