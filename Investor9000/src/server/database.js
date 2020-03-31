const maria = require('mariadb');
const config = require('./config/config');

const pool = maria.createPool({
    connectionLimit: 20,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) {
        connection.end();
    }
});

module.exports = pool;
