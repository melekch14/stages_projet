// routes/auth.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/updates/:id', authController.updateUserPassword);
router.post('/disconnect', authController.disconnect);

module.exports = router;
