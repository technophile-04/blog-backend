const express = require('express');
const {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUsersCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
	fetchUserProfileCtrl,
	updateUserProfileCtrl,
	updateUserPasswordCtrl,
	followingUserCtrl,
	unfollowUserCtrl,
} = require('../../controllers/user/usersCtrl');

const userRoutes = express.Router();

const authMiddleware = require('../../middlewares/auth/authMiddleware');

// Register
userRoutes.post('/register', userRegisterCtrl);

// Login
userRoutes.post('/login', userLoginCtrl);

// Fetch all  users
userRoutes.get('/', authMiddleware, fetchAllUsersCtrl);

// fetch user profile
userRoutes.get('/profile/:profileId', authMiddleware, fetchUserProfileCtrl);

// update user password
userRoutes.put('/password', authMiddleware, updateUserPasswordCtrl);

// following user
userRoutes.put('/follow', authMiddleware, followingUserCtrl);

// unFollow user
userRoutes.put('/unfollow', authMiddleware, unfollowUserCtrl);

// update user profile
userRoutes.put('/:userId', authMiddleware, updateUserProfileCtrl);

// fetch user details
userRoutes.get('/:userId', fetchUserDetailsCtrl);

// Delete a user
userRoutes.delete('/:userId', deleteUserCtrl);

module.exports = userRoutes;
