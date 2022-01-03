const express = require('express');
const {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
} = require('../../controllers/comment/commentCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, createCommentCtrl);
commentRoutes.get('/', fetchAllCommentsCtrl);
commentRoutes.get('/:commentId', authMiddleware, fetchCommentCtrl);
commentRoutes.put('/:commentId', authMiddleware, updateCommentCtrl);
commentRoutes.delete('/:commentId', authMiddleware, deleteCommentCtrl);

module.exports = commentRoutes;
