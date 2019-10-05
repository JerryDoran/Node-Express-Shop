const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

// CREATE A NEW USER
router.post('/signup', UserController.userSignUp);

// SET UP A LOGIN ROUTE WITH AUTHENTICATION
router.post('/login', UserController.userLogin);

router.delete('/:userId', checkAuth, UserController.userDeleteUser);

module.exports = router;
