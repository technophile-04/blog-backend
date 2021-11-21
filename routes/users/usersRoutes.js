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
	blockUserCtrl,
	unBlockUserCtrl,
	generateVerificationTokenCtrl,
	accountVerificationCrl,
	forgotPasswordTokenCtrl,
	passwrodResetCtrl,
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

// block user
userRoutes.put('/block-user/:id', authMiddleware, blockUserCtrl);

// unblock user
userRoutes.put('/unblock-user/:id', authMiddleware, unBlockUserCtrl);

// verif account
userRoutes.put('/verfiy-account', authMiddleware, accountVerificationCrl);

// verif account
userRoutes.post('/forgot-password-token', forgotPasswordTokenCtrl);

// reset password account
userRoutes.post('/reset-password', passwrodResetCtrl);

// update user profile
userRoutes.put('/:userId', authMiddleware, updateUserProfileCtrl);

// send mail
userRoutes.post(
	'/generate-verify-email-token',
	authMiddleware,
	generateVerificationTokenCtrl
);

// fetch user details
userRoutes.get('/:userId', fetchUserDetailsCtrl);

// Delete a user
userRoutes.delete('/:userId', deleteUserCtrl);

module.exports = userRoutes;
