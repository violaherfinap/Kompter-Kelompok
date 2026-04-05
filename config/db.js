require('dotenv').config();

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 1433,
    options: {
        trustServerCertificate: true
    }
};

module.exports = dbConfig;