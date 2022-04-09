const mysql = require('mysql2/promise')
require('dotenv').config({path:"./environment/.env"});
const config = require('config');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: config.get('password_db'),
    database: config.get('db_base'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
module.exports = {
    pool
}