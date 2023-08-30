const getDB = require('../../db/getDB');
const deletePhoto = require('../../services/deletePhoto');
const deleteVideo = require('../../services/deleteVideo');

const deletePublicationQuery = async (publicationId) => {
  let client;

  try {
    client = await getDB();

    await client.query('DELETE FROM comments WHERE publication_id = $1', [
      publicationId,
    ]);

    const { rows: deletePhotoPublications } = await client.query(
      'SELECT photo_name FROM publications WHERE id = $1',
      [publicationId]
    );

    const photoName = deletePhotoPublications[0]?.photo_name;

    if (photoName?.length > 0) {
      await deletePhoto(photoName);
    }

    const { rows: deleteVideoPublications } = await client.query(
      'SELECT video_name FROM publications WHERE id = $1',
      [publicationId]
    );

    const videoName = deleteVideoPublications[0]?.video_name;

    if (videoName?.length > 0) {
      await deleteVideo(videoName);
    }

    await client.query('DELETE FROM publications WHERE id = $1', [
      publicationId,
    ]);

    await client.query('COMMIT');
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = deletePublicationQuery;
