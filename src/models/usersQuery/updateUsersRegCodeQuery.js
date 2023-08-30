const getDB = require('../../db/getDB');
const { generateError } = require('../../services/errors');

const updateUsersRegCodeQuery = async (regCode) => {
  let connection;

  try {
    connection = await getDB();

    const queryResult = await connection.query(
      `SELECT registrationCode FROM users WHERE registrationCode = $1`,
      [regCode]
    );

    const modifiedAt = new Date();

    const query = `
            UPDATE users
            SET registrationCode = null, active = true, modifiedAt = $1
            WHERE registrationCode = $2
        `;

    const values = [modifiedAt, regCode];

    await connection.query(query, values);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUsersRegCodeQuery;

