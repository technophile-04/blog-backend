const express = require('express');
const {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
} = require('../../controllers/comment/commentCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, createCommentCtrl);
commentRoutes.get('/', authMiddleware, fetchAllCommentsCtrl);
commentRoutes.get('/:commentId', authMiddleware, fetchCommentCtrl);
commentRoutes.put('/:commentId', authMiddleware, updateCommentCtrl);

module.exports = commentRoutes;
