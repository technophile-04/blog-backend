const express = require('express');
const {
	createPostCtrl,
	fetchPostsCtrl,
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

module.exports = postRoutes;
