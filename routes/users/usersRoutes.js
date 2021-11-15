const express = require('express');
const {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUsersCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
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

// fetch user details
userRoutes.get('/:userId', fetchUserDetailsCtrl);

module.exports = userRoutes;
