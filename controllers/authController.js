// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/db');
exports.register = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (existingUser) => {
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        User.createUser(username, hash, (userId) => {
          res.status(201).json({ message: 'User registered', userId });
        });
      });
    }
  });
};

exports.updateUserPassword = (req, res) => {
  const  userId  = req.params.id;
  const { username, password } = req.body;

  // Hash the new password before updating it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update password' });
    } else {
      // SQL query to update the user's password
      const sql = 'UPDATE responsable SET password = ? WHERE id_res = ?';

      // Execute the SQL query
      db.query(sql, [hash, userId], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Failed to update password in the database' });
        } else {
          if (result.affectedRows > 0) {
            res.json({ message: 'Password updated successfully' });
          } else {
            res.status(404).json({ error: 'User not found' });
          }
        }
      });
    }
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (user) => {
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;

        if (result) {
          const token = jwt.sign({ userId: user.id_res , username: username }, 'ryhabarafet', { expiresIn: '1h' });

          res.cookie('token', token, { httpOnly: true });

          res.status(200).json({ message: 'Login successful', token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      });
    }
  });
};

exports.disconnect = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
