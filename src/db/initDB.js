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

