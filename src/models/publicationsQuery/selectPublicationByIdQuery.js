const getDB = require('../../db/getDB');
const { generateError } = require('../../services/errors');

const selectPublicationtByIdQuery = async (publicationId, userId = 0) => {
    let client;

    try {
        client = await getDB();

        const { rows: publications } = await client.query(
            `
            SELECT
            P.id AS publicationId,
            P.title,
            P.place,
            P.type,
            P.user_id AS userId,
            P.description,
            U.username AS author,
            U.avatar AS authorAvatar, -- Nuevo campo para el avatar del autor
            P.user_id AS authorId,
            P.photo_name AS photoName,
            P.video_name AS videoName,
            P.user_id = $1 AS owner,
            P.created_at AS createdAt,
            COUNT(L.id) AS likes,
            BOOL_OR(L.user_id = $1) AS likedByMe,
            C.id AS commentId,
            C.text AS commentText,
            UC.username AS commenter,
            UC.avatar AS commenterAvatar
        FROM publications P
        INNER JOIN users U ON P.user_id = U.id
        LEFT JOIN likes L ON P.id = L.publication_id
        LEFT JOIN comments C ON P.id = C.publication_id
        LEFT JOIN users UC ON C.user_id = UC.id
        WHERE P.id = $2
        GROUP BY P.id, C.id
      `,
            [userId, publicationId]
        );

        if (publications.length < 1) {
            generateError('Publicación no encontrada', 404);
        }

        const publication = {
            id: publications[0].publicationId,
            title: publications[0].title,
            place: publications[0].place,
            type: publications[0].type,
            description: publications[0].description,
            author: publications[0].author,
            authorId: publications[0].authorId,
            photoName: publications[0].photoName,
            videoName: publications[0].videoName,
            owner: publications[0].owner,
            createdAt: publications[0].createdAt,
            likes: publications[0].likes,
            likedByMe: publications[0].likedByMe,
            authorAvatar: publications[0].authorAvatar,
            comments: [],
        };

        publications.forEach((row) => {
            if (row.commentId) {
                publication.comments.push({
                    id: row.commentId,
                    text: row.commentText,
                    commenter: row.commenter,
                    commenterAvatar: row.commenterAvatar,
                    owner: row.owner,
                    createdAt: row.createdAt,
                });
            }
        });

        return publication;
    } finally {
        if (client) client.release();
    }
};

module.exports = selectPublicationtByIdQuery;
