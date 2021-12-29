const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Post title is required'],
			trim: true,
		},

		category: {
			type: String,
			required: [true, 'Category of post is required'],
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please user author is required'],
		},
		description: {
			type: String,
			required: [true, 'Description of post is required'],
		},

		image: {
			type: String,
			default:
				'https://cdn.pixabay.com/photo/2016/11/12/23/00/mailbox-1819966_1280.jpg',
		},
		numViews: {
			type: Number,
			default: 0,
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
