const Post = require('../../model/post/Post');
const fs = require('fs');
const User = require('../../model/user/User');
const Filter = require('bad-words');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongoDbId');
const cloudinaryUploadImage = require('../../utils/cloudinary');

// ---------------------------------
//  Create post
// ---------------------------------
const createPostCtrl = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	let imgUrl;
	const user = req.user.id;
	const filter = new Filter();

	const isBadWordsPresent = filter.isProfane(title, description);

	if (isBadWordsPresent) {
		await User.findByIdAndUpdate(req.user.id, {
			isBlocked: true,
		});
		throw new Error(
			'Post creation failed beacause it contains profane words and you have been blocked!'
		);
	}

	validateMongoDbId(user);

	if (req.file) {
		const localPath = `public/images/posts/${req.file.filename}`;
		const uploadedImg = await cloudinaryUploadImage(localPath);
		imgUrl = uploadedImg.url;
		fs.unlinkSync(localPath);
	}

	try {
		const post = await Post.create({
			title,
			description,
			user,
			image: imgUrl && imgUrl,
		});

		res.json(post);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// ---------------------------------
//  Fetch all Post
// ---------------------------------
const fetchPostsCtrl = asyncHandler(async (req, res) => {
	try {
		const allPosts = await Post.find({});
		res.json(allPosts);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// ---------------------------------
//  Fetch a Post
// ---------------------------------
const fetchPostCtrl = asyncHandler(async (req, res) => {
	const { postId } = req.params;

	validateMongoDbId(postId);

	try {
		await Post.findById(postId).populate('user');

		const UpdatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);

		res.json(UpdatedPost);
	} catch (error) {
		res.json({ message: error.message });
	}

	// res.json(postId);
});

// ---------------------------------
//  Update a post
// ---------------------------------

const updatePostCtrl = asyncHandler(async (req, res) => {
	const { postId } = req.params;
	validateMongoDbId(postId);

	try {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				...req.body,
				user: req.user.id,
			},
			{ new: true }
		);

		res.json(updatedPost);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// ---------------------------------
//  Delete a Post
// ---------------------------------

const deletePostCtrl = asyncHandler(async (req, res) => {
	const { postId } = req.params;
	validateMongoDbId(postId);

	try {
		await Post.findByIdAndDelete(postId);

		res.json({ message: 'Post deleted successfully' });
	} catch (error) {
		res.json({ message: error.message });
	}
});

module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePostCtrl,
};
