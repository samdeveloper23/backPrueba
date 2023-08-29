const { Pool } = require('pg');

const { PG_HOST, PG_USER, PG_PASS, PG_DB, DATABASE_URL } = process.env;

let pool;

const getDB = async () => {
    try {
        if (!pool) {
            const sslOptions = {
                rejectUnauthorized: false, // Cambiar a 'true' una vez tengas el certificado SSL adecuado
                mode: 'prefer',
            };

            pool = new Pool({
                max: 10,
                host: PG_HOST,
                port: 5432, // Puerto predeterminado de PostgreSQL
                user: PG_USER,
                password: PG_PASS,
                ssl: sslOptions,
                database: PG_DB || '', // Opcionalmente, utiliza PG_DB si está definido
                connectionString: DATABASE_URL, // Usar DATABASE_URL si está definido
            });
        }

        return await pool.connect();
    } catch (error) {
        console.error(error);
    }
};

module.exports = getDB;
