const getDB = require('../../db/getDB');

const updateUserEmailToDeletedQuery = async (userId) => {
  let connection;
  try {
    connection = await getDB();

    await connection.query('DELETE FROM comments WHERE userId = $1', [userId]);

    await connection.query('DELETE FROM likes WHERE userId = $1', [userId]);

    await connection.query('DELETE FROM publications WHERE userId = $1', [
      userId,
    ]);

    await connection.query('DELETE FROM users WHERE id = $1', [userId]);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = updateUserEmailToDeletedQuery;
