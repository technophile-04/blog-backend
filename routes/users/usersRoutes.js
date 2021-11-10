const express = require('express');
const { userRegisterCtrl } = require('../../controllers/user/usersCtrl');

const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);

// Login
userRoutes.post('/login', (req, res) => {
	res.json({
		user: 'User is login',
	});
});

module.exports = userRoutes;
