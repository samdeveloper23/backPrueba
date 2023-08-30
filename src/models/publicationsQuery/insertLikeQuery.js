const getDB = require('../../db/getDB');

const { generateError } = require('../../services/errors');

const insertLikeQuery = async (publicationId, userId) => {
  let client;

  try {
    client = await getDB();

    const { rows: likes } = await client.query(
      `SELECT id FROM likes WHERE publicationId = $1 AND userId = $2`,
      [publicationId, userId]
    );

    if (likes.length > 0) {
      generateError('No puedes dar like dos veces a la misma publicación', 403);
    }

    await client.query(
      `INSERT INTO likes(publicationId, userId, createdAt) VALUES($1, $2, $3)`,
      [publicationId, userId, new Date()]
    );
  } finally {
    if (client) client.release();
  }
};

module.exports = insertLikeQuery;
