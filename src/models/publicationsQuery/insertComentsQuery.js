const getDB = require('../../db/getDB');

const insertComment = async (text, publicationId, userId) => {
  let client;

  try {
    client = await getDB();

    const { rows: comment } = await client.query(
      `INSERT INTO comments(text, publicationId, userId, createdAt) VALUES($1, $2, $3, $4) RETURNING id`,
      [text, publicationId, userId, new Date()]
    );

    return {
      id: comment[0].id,
      text,
    };
  } finally {
    if (client) client.release();
  }
};

module.exports = insertComment;
