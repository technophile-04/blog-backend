const express = require('express');
const {
	userRegisterCtrl,
	userLoginCtrl,
} = require('../../controllers/user/usersCtrl');

const userRoutes = express.Router();

userRoutes.post('/register', userRegisterCtrl);

// Login
userRoutes.post('/login', userLoginCtrl);

module.exports = userRoutes;
