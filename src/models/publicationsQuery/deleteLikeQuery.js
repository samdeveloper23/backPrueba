const getDB = require('../../db/getDB');
const { generateError } = require('../../services/errors');

const deleteLikeQuery = async (publicationId, userId) => {
  let client;

  try {
    client = await getDB();

    const { rows: likes } = await client.query(
      `SELECT id FROM likes WHERE publicationId = $1 AND userId = $2`,
      [publicationId, userId]
    );

    if (likes.length < 1) {
      generateError('Aún no hay ningún like', 404);
    }

    await client.query(
      `DELETE FROM likes WHERE publicationId = $1 AND userId = $2`,
      [publicationId, userId]
    );
  } finally {
    if (client) client.release();
  }
};

module.exports = deleteLikeQuery;
