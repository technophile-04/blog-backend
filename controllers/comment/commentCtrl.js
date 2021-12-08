const Comment = require('../../model/comment/Comment');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongoDbId');

// ---------------------------------
//  Create Comment
// ---------------------------------

const createCommentCtrl = asyncHandler(async (req, res) => {
	const user = req.user;
	const { postId, description } = req.body;
	validateMongoDbId(postId);

	try {
		const comment = await Comment.create({
			post: postId,
			user,
			description,
		});

		res.json(comment);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// ---------------------------------
//  Fetch all comments
// ---------------------------------

const fetchAllCommentsCtrl = asyncHandler(async (req, res) => {
	try {
		const comments = await Comment.find({}).sort('-createdAt');
		res.json(comments);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// ---------------------------------
//  Fetch a comment
// ---------------------------------

const fetchCommentCtrl = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	validateMongoDbId(commentId);

	try {
		const comment = await Comment.findById(commentId);
		res.json(comment);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// ---------------------------------
//  Update comment
// ---------------------------------

const updateCommentCtrl = asyncHandler(async (req, res) => {
	const { description, postId } = req.body;
	const user = req?.user;
	const { commentId } = req.params;
	validateMongoDbId(commentId);

	try {
		const updateComment = await Comment.findByIdAndUpdate(
			commentId,
			{
				post: postId,
				description,
				user,
			},
			{ new: true, runValidators: true }
		);

		res.json(updateComment);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// ---------------------------------
//  Delete a comment
// ---------------------------------

const deleteCommentCtrl = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	validateMongoDbId(commentId);

	try {
		await Comment.findByIdAndDelete(commentId);
		res.json('Comment deleted successfully!');
	} catch (error) {
		res.json({ error: error.message });
	}
});

module.exports = {
	createCommentCtrl,
	fetchAllCommentsCtrl,
	fetchCommentCtrl,
	updateCommentCtrl,
	deleteCommentCtrl,
};
