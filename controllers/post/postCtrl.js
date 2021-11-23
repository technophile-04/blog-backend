const Post = require('../../model/post/Post');
const User = require('../../model/user/User');
const Filter = require('bad-words');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongoDbId');
//  create post controller

const createPostCtrl = asyncHandler(async (req, res) => {
	const { title, description, user } = req.body;
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

	try {
		const post = await Post.create({ title, description, user });

		res.json(post);
	} catch (error) {
		res.json({ message: error.message });
	}
});

module.exports = { createPostCtrl };
