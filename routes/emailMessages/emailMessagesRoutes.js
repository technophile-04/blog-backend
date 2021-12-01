const express = require('express');
const {
	sendEmailMessageCtrl,
} = require('../../controllers/emailMessage/emailMessageCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const emailMessagesRoutes = express.Router();

emailMessagesRoutes.post('/', authMiddleware, sendEmailMessageCtrl);

module.exports = emailMessagesRoutes;
