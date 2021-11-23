const express = require('express');
const { createPostCtrl } = require('../../controllers/post/postCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, createPostCtrl);

module.exports = postRoutes;
