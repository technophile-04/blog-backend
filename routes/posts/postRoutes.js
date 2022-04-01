const express = require('express');
const {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePostCtrl,
	toggleAddLikeToPostCtrl,
	toggleAddDislikeToPostCtrl,
} = require('../../controllers/post/postCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const handleBlockedUser = require('../../middlewares/auth/handleBlockedUser');
const {
	imageUpload,
	postImageResize,
} = require('../../middlewares/upload/imageUpload');
const postRoutes = express.Router();

postRoutes.post(
	'/',
	authMiddleware,
	handleBlockedUser,
	imageUpload.single('image'),
	postImageResize,
	createPostCtrl
);

postRoutes.get('/', fetchPostsCtrl);
postRoutes.put(
	'/likes',
	authMiddleware,
	handleBlockedUser,
	toggleAddLikeToPostCtrl
);
postRoutes.put(
	'/dislikes',
	authMiddleware,
	handleBlockedUser,
	toggleAddDislikeToPostCtrl
);
postRoutes.get('/:postId', fetchPostCtrl);
postRoutes.put('/:postId', authMiddleware, updatePostCtrl);
postRoutes.delete('/:postId', authMiddleware, deletePostCtrl);

module.exports = postRoutes;
