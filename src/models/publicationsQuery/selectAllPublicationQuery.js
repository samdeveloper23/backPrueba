const getDB = require('../../db/getDB');
const { generateError } = require('../../services/errors');

const selectAllPublicationQuery = async (
    keyword = '',
    date = '',
    userId = 0
) => {
    let client;

    try {
        client = await getDB();

        date = date.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { rows: results } = await client.query(
            `
            SELECT
    P.id AS publicationId,
    P.title,
    P.place,
    P.type,
    P.description,
    U.username AS author,
    U.avatar AS authorAvatar,
    P.userId AS authorId,
    P.photoName AS photoName,
    P.videoName AS videoName,
    CASE WHEN P.userId = $1 THEN TRUE ELSE FALSE END AS "owner",
    P.createdAt AS createdAt,
    COUNT(L.id) AS likes,
    BOOL_OR(L.userId = $1) AS likedByMe,
    C.id AS commentId,
    C.text AS commentText,
    UC.username AS commenter,
    UC.avatar AS commenterAvatar
FROM publications P
INNER JOIN users U ON P.userId = U.id 
LEFT JOIN likes L ON P.id = L.publicationId
LEFT JOIN comments C ON P.id = C.publicationId
LEFT JOIN users UC ON C.userId = UC.id
WHERE P.title ILIKE $2 OR P.place ILIKE $2 OR P.description ILIKE $2 OR P.type ILIKE $2 OR U.username ILIKE $2
GROUP BY P.id, P.title, P.place, P.type, P.description, U.username, U.avatar, P.userId, P.photoName, P.videoName, "owner", P.createdAt, C.id, C.text, UC.username, UC.avatar
ORDER BY P.createdAt ${date}


    `,
            [
                userId,
                `%${keyword}%`,
            ]
        );

        if (results.length < 1) {
            generateError('No hay resultados', 404);
        }

        const publications = [];
        const comments = [];

        results.forEach((row) => {
            const {
                publicationId,
                title,
                place,
                type,
                description,
                author,
                authorId,
                authorAvatar,
                photoName,
                videoName,
                owner,
                createdAt,
                likes,
                likedByMe,
                commentId,
                commentText,
                commenter,
                commenterAvatar,
            } = row;

            if (!publications.some((pub) => pub.id === publicationId)) {
                publications.push({
                    id: publicationId,
                    title,
                    place,
                    type,
                    description,
                    author,
                    authorId,
                    authorAvatar,
                    photoName,
                    videoName,
                    owner,
                    createdAt,
                    likes,
                    likedByMe,
                    comments: [],
                });
            }

            if (commentId) {
                publications
                    .find((pub) => pub.id === publicationId)
                    .comments.push({
                        id: commentId,
                        text: commentText,
                        commenter,
                        commenterAvatar,
                    });
            }
        });

        return publications;
    } finally {
        if (client) client.release();
    }
};

module.exports = selectAllPublicationQuery;
