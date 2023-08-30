const getDB = require('../../db/getDB');

const insertPublicationQuery = async (
    title,
    photoName,
    videoName,
    place,
    type,
    description,
    userId
) => {
    let client;

    try {
        client = await getDB();

        const createdAt = new Date();

        const { rows: publication } = await client.query(
            `INSERT INTO publications(title, photo_name, video_name, place, type, description, user_id, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                title,
                photoName,
                videoName,
                place,
                type,
                description,
                userId,
                createdAt,
            ]
        );

        return {
            id: publication[0].id,
            title,
            photoName,
            videoName,
            place,
            type,
            description,
            userId,
            createdAt,
        };
    } finally {
        if (client) client.release();
    }
};

module.exports = insertPublicationQuery;
