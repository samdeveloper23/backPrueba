const getDB = require('../../db/getDB');

const { generateError } = require('../../services/errors');

const insertLikeQuery = async (publicationId, userId) => {
  let client;

  try {
    client = await getDB();

    const { rows: likes } = await client.query(
      `SELECT id FROM likes WHERE publication_id = $1 AND user_id = $2`,
      [publicationId, userId]
    );

    if (likes.length > 0) {
      generateError('No puedes dar like dos veces a la misma publicación', 403);
    }

    await client.query(
      `INSERT INTO likes(publication_id, user_id, created_at) VALUES($1, $2, $3)`,
      [publicationId, userId, new Date()]
    );
  } finally {
    if (client) client.release();
  }
};

module.exports = insertLikeQuery;
