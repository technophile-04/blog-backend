const express = require('express');
const {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUsersCtrl,
	deleteUserCtrl,
} = require('../../controllers/user/usersCtrl');

const userRoutes = express.Router();

// Register
userRoutes.post('/register', userRegisterCtrl);

// Login
userRoutes.post('/login', userLoginCtrl);

// Fetch all  users
userRoutes.get('/', fetchAllUsersCtrl);

// Delete a user
userRoutes.delete('/:userId', deleteUserCtrl);

module.exports = userRoutes;
