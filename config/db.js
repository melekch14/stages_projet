// config/db.js
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mystages', 
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');

  
  checkAndAddRow();
});

// Function to check if the table is empty
function checkIfTableIsEmpty(callback) {
  const query = 'SELECT COUNT(*) AS rowCount FROM responsable'; 
  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }

    const rowCount = result[0].rowCount;
    if (rowCount === 0) {
      // The table is empty
      callback(true);
    } else {
      // The table is not empty
      callback(false);
    }
  });
}

// Function to add a row to the table
function addRowToTable(username, password) {
  // Hash the password using bcrypt
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      throw err;
    }

    const insertQuery = 'INSERT INTO responsable (username, password) VALUES (?, ?)';
    const values = [username, hashedPassword];

    connection.query(insertQuery, values, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('Row added to the table.');
    });
  });
}

// Function to check if the table is empty and add a row if it is
function checkAndAddRow() {
  checkIfTableIsEmpty((isEmpty) => {
    if (isEmpty) {
      // Table is empty, so add a row
      addRowToTable('admin','admin');
    } else {
      // Table is not empty, you can handle this case accordingly
      console.log('Table is not empty.');
    }
  });
}

module.exports = connection;
