const getDB = require('../../db/getDB');

const updateUserAvatarQuery = async (avatar, userId) => {
  let connection;

  try {
    connection = await getDB();

    const query = `
      UPDATE users
      SET avatar = $1, modifiedAt = $2
      WHERE id = $3
    `;

    const values = [avatar, new Date(), userId];

    await connection.query(query, values);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = updateUserAvatarQuery;
