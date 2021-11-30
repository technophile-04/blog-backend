const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Types.ObjectId,
			ref: 'Post',
			required: [true, 'Post Id is required'],
		},
		user: {
			type: Object,
			required: [true, 'User is required'],
		},
		description: {
			type: String,
			required: [true, 'Post description is required'],
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
