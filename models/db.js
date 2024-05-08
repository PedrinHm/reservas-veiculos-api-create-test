// models/db.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 30000
});

/* db.getConnection()
    .then(() => console.log('Conexão com o banco de dados bem-sucedida'))
    .catch((err) => console.error('Erro ao conectar ao banco de dados:', err.message)); */

module.exports = db;
