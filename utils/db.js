const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 27738,
    ssl: false
});


db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');

    db.query('CREATE DATABASE IF NOT EXISTS school_management', (err) => {
        if (err) throw err;
        console.log('Database created or already exists.');

      
        db.query('USE school_management', (err) => {
            if (err) throw err;
            console.log('Using database school_management.');

            // Create table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS schools (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    address VARCHAR(255) NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) throw err;
                console.log('Table created or already exists.');
            });
        });
    });
});

module.exports = db;
