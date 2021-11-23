const express = require('express');
const { createPostCtrl } = require('../../controllers/post/postCtrl');
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

module.exports = postRoutes;
