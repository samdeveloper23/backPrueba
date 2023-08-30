require('dotenv').config();
const getDB = require('./getDB');

const main = async () => {
    let client;

    try {
        client = await getDB();

        console.log('Borrando tablas...');

        await client.query('DROP TABLE IF EXISTS comments');
        await client.query('DROP TABLE IF EXISTS likes');
        await client.query('DROP TABLE IF EXISTS publications');
        await client.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                ownername VARCHAR(100) NOT NULL,
                role VARCHAR(10) DEFAULT 'Gato',
                avatar VARCHAR(100),
                place VARCHAR(70),
                personalInfo VARCHAR(300),
                active BOOLEAN DEFAULT false,
                registrationCode VARCHAR(50),
                recoverPassCode VARCHAR(50),
                createdAt TIMESTAMPTZ NOT NULL,
                modifiedAt TIMESTAMPTZ
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS publications (
                id SERIAL PRIMARY KEY,
                title VARCHAR(50) NOT NULL,
                photoName VARCHAR(100),
                videoName VARCHAR(100),
                place VARCHAR(100),
                type VARCHAR(20) DEFAULT 'Normal',
                description VARCHAR(200),
                userId INT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            )    
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id SERIAL PRIMARY KEY,
                publicationId INT NOT NULL,
                userId INT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP,
                FOREIGN KEY (publicationId) REFERENCES publications(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                text VARCHAR(200) NOT NULL,
                publicationId INT NOT NULL,
                userId INT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                FOREIGN KEY (publicationId) REFERENCES publications(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);

        // Los otros queries de creación de tablas se mantienen similares, con ajustes en sintaxis

        console.log('¡Tablas creadas!');
    } catch (error) {
        console.error(error);
    } finally {
        if (client) client.release();

        process.exit();
    }
};

main();

