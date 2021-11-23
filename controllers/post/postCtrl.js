const Post = require('../../model/post/Post');
const fs = require('fs');
const User = require('../../model/user/User');
const Filter = require('bad-words');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../../utils/validateMongoDbId');
const cloudinaryUploadImage = require('../../utils/cloudinary');
//  create post controller

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

module.exports = { createPostCtrl };
