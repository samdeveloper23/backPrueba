const getDB = require('../../db/getDB');

const deleteCommentByIdQuery = async (commentId, publicationId) => {
  let client;

  try {
    client = await getDB();

    const { rows: comment } = await client.query(
      'SELECT * FROM comments WHERE publication_id = $1 AND id = $2',
      [publicationId, commentId]
    );

    if (comment.length === 0) {
      throw new Error('El comentario no existe');
    }

    await client.query(
      'DELETE FROM comments WHERE id = $1 AND publication_id = $2',
      [commentId, publicationId]
    );
  } finally {
    if (client) client.release();
  }
};

module.exports = deleteCommentByIdQuery;
