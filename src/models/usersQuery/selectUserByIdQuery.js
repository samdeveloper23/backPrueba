const getDB = require('../../db/getDB');

const selectUsersByIdQuery = async (userId) => {
  let connection;

  try {
    connection = await getDB();
    console.log(userId);
    const query = `
      SELECT
        u.id AS userId,
        u.email,
        u.username,
        u.role,
        u.avatar,
        u.place,
        u.personalInfo,
        u.active,
        u.createdAt AS userCreatedAt,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', p.id,
            'title', p.title,
            'photoName', p.photoName,
            'videoName', p.videoName,
            'place', p.place,
            'description', p.description,
            'createdAt', p.createdAt
          )
        ) AS publications
      FROM users u
      LEFT JOIN publications p ON u.id = p.userId
      WHERE u.id = $1
      GROUP BY u.id, u.email, u.username, u.role, u.avatar, u.place, u.personalInfo, u.active, u.createdAt
    `;

    const values = [userId];

    const { rows: users } = await connection.query(query, values);

    return users[0];
  } finally {
    if (connection) connection.release();
  }
};

module.exports = selectUsersByIdQuery;

