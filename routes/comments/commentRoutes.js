const express = require('express');
const {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
} = require('../../controllers/comment/commentCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const handleBlockedUser = require('../../middlewares/auth/handleBlockedUser');

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, handleBlockedUser, createCommentCtrl);
commentRoutes.get('/', fetchAllCommentsCtrl);
commentRoutes.get('/:commentId', authMiddleware, fetchCommentCtrl);
commentRoutes.put(
	'/:commentId',
	authMiddleware,
	handleBlockedUser,
	updateCommentCtrl
);
commentRoutes.delete('/:commentId', authMiddleware, deleteCommentCtrl);

module.exports = commentRoutes;
