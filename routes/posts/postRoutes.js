const express = require('express');
const {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePostCtrl,
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
postRoutes.get('/:postId', fetchPostCtrl);
postRoutes.put('/:postId', authMiddleware, updatePostCtrl);
postRoutes.delete('/:postId', authMiddleware, deletePostCtrl);

module.exports = postRoutes;
