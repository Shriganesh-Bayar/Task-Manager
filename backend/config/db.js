const mysql = require('mysql2');
require('dotenv').config();

// pool is the collection of connection of database.
const pool = mysql.createPool({
    host: process.env.task_host,
    user: process.env.task_user,
    password: process.env.task_password,
    database: process.env.task_database
}); 

module.exports = pool.promise();