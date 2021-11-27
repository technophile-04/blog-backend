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
const {
	imageUpload,
	postImageResize,
} = require('../../middlewares/upload/imageUpload');
const postRoutes = express.Router();

postRoutes.post(
	'/',
	authMiddleware,
	imageUpload.single('image'),
	postImageResize,
	createPostCtrl
);

postRoutes.get('/', fetchPostsCtrl);
postRoutes.put('/likes', authMiddleware, toggleAddLikeToPostCtrl);
postRoutes.put('/dislikes', authMiddleware, toggleAddDislikeToPostCtrl);
postRoutes.get('/:postId', fetchPostCtrl);
postRoutes.put('/:postId', authMiddleware, updatePostCtrl);
postRoutes.delete('/:postId', authMiddleware, deletePostCtrl);

module.exports = postRoutes;
