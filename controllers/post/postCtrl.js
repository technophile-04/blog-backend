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
		const post = await Post.findById(postId)
			.populate('user')
			.populate('dislikes')
			.populate('likes');

		await Post.findByIdAndUpdate(
			postId,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);

		res.json(post);
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

// ---------------------------------
//  Like a post
// ---------------------------------

const toggleAddLikeToPostCtrl = asyncHandler(async (req, res) => {
	const { postId } = req.body;

	const post = await Post.findById(postId);

	const loginUserId = req?.user?.id;

	const isLiked = post?.isLiked;

	const isAlreadyDisLiked = post.dislikes.find(
		(userId) => userId.toString() === loginUserId.toString()
	);

	if (isAlreadyDisLiked) {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				$pull: { dislikes: loginUserId },
				isDisLiked: false,
			},
			{ new: true }
		);

		res.json(updatedPost);
	}

	if (isLiked) {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { likes: loginUserId }, isLiked: false },
			{ new: true }
		);

		res.json(updatedPost);
	} else {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $push: { likes: loginUserId }, isLiked: true },
			{ new: true }
		);
		res.json(updatedPost);
	}
});

// ---------------------------------
//  Toggle dislike a post
// ---------------------------------

const toggleAddDislikeToPostCtrl = asyncHandler(async (req, res) => {
	const { postId } = req.body;

	const loginUserId = req.user?.id;

	const post = await Post.findById(postId);

	const isDisLiked = post.isDisLiked;

	const isAlreadyLike = post.likes?.find(
		(userId) => userId.toString() === loginUserId.toString()
	);

	if (isAlreadyLike) {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { likes: loginUserId }, isLiked: false },
			{ new: true }
		);
		res.json(updatedPost);
	}

	if (isDisLiked) {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { dislikes: loginUserId }, isDisLiked: false },
			{ new: true }
		);
		res.json(updatedPost);
	} else {
		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $push: { dislikes: loginUserId }, isDisLiked: true },
			{ new: true }
		);
		res.json(updatedPost);
	}
});

module.exports = {
	createPostCtrl,
	fetchPostsCtrl,
	fetchPostCtrl,
	updatePostCtrl,
	deletePostCtrl,
	toggleAddLikeToPostCtrl,
	toggleAddDislikeToPostCtrl,
};
