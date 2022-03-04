require('dotenv').config();
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../../model/user/User');
const generateToken = require('../../config/token/generateToken');
const validateMongoDbId = require('../../utils/validateMongoDbId');
const sgMail = require('@sendgrid/mail');
const cloudinaryUploadImage = require('../../utils/cloudinary');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// we keep only bussiness logic here thats why have encryted and decrypted pass in user model file

// -----------------------------------------------
// REGISTER
// -----------------------------------------------

const userRegisterCtrl = asyncHandler(async (req, res) => {
	const userExist = await User.findOne({ email: req?.body?.email });

	if (userExist) throw new Error('User already exists');

	try {
		const user = await User.create({
			firstName: req?.body?.firstName,
			lastName: req?.body?.lastName,
			email: req?.body?.email,
			password: req?.body?.password,
		});

		res.json(user);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// LOGIN
// -----------------------------------------------

const userLoginCtrl = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email: email });

	if (!user || !(await user.isPasswordMatched(password))) {
		res.status(401);
		throw new Error('Login credentials are not valid');
	}

	res.json({
		_id: user?._id,
		firstName: user?.firstName,
		lastName: user?.lastName,
		email: user?.email,
		bio: user?.bio,
		profilePhoto: user?.profilePhoto,
		isAdmin: user?.isAdmin,
		isAccountVerified: user?.isAccountVerified,
		token: generateToken(user?._id),
	});
});

// -----------------------------------------------
// ALL USERS
// -----------------------------------------------

const fetchAllUsersCtrl = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({}).populate('posts');
		res.json(users);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// Delete user
// -----------------------------------------------

const deleteUserCtrl = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	validateMongoDbId(userId);

	try {
		const deletedUser = await User.findByIdAndDelete(userId);

		res.json(deletedUser);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// user details
// -----------------------------------------------

const fetchUserDetailsCtrl = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	validateMongoDbId(userId);

	try {
		const user = await User.findById(userId);

		res.json(user);
	} catch (error) {
		res.send({ message: error.message });
	}
});

// -----------------------------------------------
// user profile
// -----------------------------------------------

const fetchUserProfileCtrl = asyncHandler(async (req, res) => {
	const { profileId } = req.params;
	const loginUserId = req?.user?._id.toString();
	validateMongoDbId(profileId);

	try {
		const userProfile = await User.findById(profileId)
			.populate('posts')
			.populate('viewedBy');
		const alreadyExist = userProfile.viewedBy?.find((user) => {
			return user?._id?.toString() === loginUserId;
		});

		console.log(alreadyExist);

		if (alreadyExist || profileId === loginUserId) {
			res.json(userProfile);
			return;
		} else {
			const updatedProfile = await User.findByIdAndUpdate(
				profileId,
				{
					$push: { viewedBy: loginUserId },
				},
				{
					new: true,
				}
			);
			res.json(updatedProfile);
		}
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// update user profile
// -----------------------------------------------

const updateUserProfileCtrl = asyncHandler(async (req, res) => {
	const { _id } = req?.user;

	validateMongoDbId(_id);

	try {
		const updatedUser = await User.findByIdAndUpdate(
			_id,
			{
				firstName: req?.body?.firstName,
				lastName: req?.body?.lastName,
				email: req?.body?.email,
				bio: req?.body?.bio,
			},
			{
				new: true,
				runValidators: true,
			}
		);

		res.json(updatedUser);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// update user password
// -----------------------------------------------
const updateUserPasswordCtrl = asyncHandler(async (req, res) => {
	const { _id } = req?.user;
	const { password } = req.body;

	validateMongoDbId(_id);

	const user = await User.findById(_id);

	if (password) {
		user.password = password;
		const updatedUser = await user.save();
		res.json(updatedUser);
	} else {
		throw new Error('Please enter a passwrd');
	}
});

// -----------------------------------------------
// Follow a user
// -----------------------------------------------
const followingUserCtrl = asyncHandler(async (req, res) => {
	// Find the logged in user who want to follow
	// get the user who will be followed by logged in user

	const { followId } = req.body;
	const { id } = req.user;

	try {
		const targetedUser = await User.findById(followId);

		const isAlreadyFollowed = await targetedUser?.followers?.find(
			(userId) => userId.toString() === id.toString()
		);

		if (isAlreadyFollowed)
			throw new Error('You are already following this user');

		const updatedUser = await User.findByIdAndUpdate(
			followId,
			{
				$push: { followers: id },
			},
			{
				new: true,
			}
		).populate('posts');

		await User.findByIdAndUpdate(
			id,
			{
				$push: { following: followId },
				isFollowing: true,
			},
			{
				new: true,
			}
		);

		res.json(updatedUser);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// Unfollow a user
// -----------------------------------------------
const unfollowUserCtrl = asyncHandler(async (req, res) => {
	const { unfollowId } = req.body;
	const { id } = req.user;

	try {
		const updatedUser = await User.findByIdAndUpdate(
			unfollowId,
			{
				$pull: { followers: id },
			},
			{
				new: true,
			}
		).populate('posts');

		await User.findByIdAndUpdate(
			id,
			{
				$pull: { following: unfollowId },
				isFollowing: false,
			},
			{ new: true }
		);

		res.json(updatedUser);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// Block a user
// -----------------------------------------------

const blockUserCtrl = asyncHandler(async (req, res) => {
	const userId = req.params.id;

	validateMongoDbId(userId);

	try {
		await User.findByIdAndUpdate(
			userId,
			{
				isBlocked: true,
			},
			{ new: true }
		);

		res.json('This is user is blocked now !');
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// UnBlock a user
// -----------------------------------------------

const unBlockUserCtrl = asyncHandler(async (req, res) => {
	const userId = req.params.id;

	validateMongoDbId(userId);

	try {
		await User.findByIdAndUpdate(
			userId,
			{
				isBlocked: false,
			},
			{ new: true }
		);

		res.json('This user is now unblocked!');
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// Generate email verification Token
// -----------------------------------------------

const generateVerificationTokenCtrl = asyncHandler(async (req, res) => {
	const loginUserId = req.user.id;

	try {
		const user = await User.findById(loginUserId);

		const verificationToken = await user.createAccountVerificationToken();

		await user.save();

		const resetUrl = `If you were requested to verify your account, verify it within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-token/${verificationToken}">Click here to verify</a>`;

		const msg = {
			to: user?.email,
			from: 'shivbhonde34@gmail.com',
			subject: 'Blog App verification',
			html: resetUrl,
		};

		await sgMail.send(msg);
		res.json('Email sent');
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// Account Verification
// -----------------------------------------------

const accountVerificationCrl = asyncHandler(async (req, res, next) => {
	try {
		const { verificationToken } = req.body;
		const hashedToken = crypto
			.createHash('sha256')
			.update(verificationToken)
			.digest('hex');

		const userFound = await User.findOne({
			accountVerificationToken: hashedToken,
			accountVerificationTokenExpires: { $gt: Date.now() },
		});

		if (!userFound) throw new Error('Token is expired, please try again!');

		userFound.isAccountVerified = true;
		userFound.accountVerificationToken = undefined;
		userFound.accountVerificationTokenExpires = undefined;

		await userFound.save();

		res.json('Congrats you are now a verified user!');
	} catch (error) {
		next(error);
	}
});

// -----------------------------------------------
// Forgot password token generatore
// -----------------------------------------------

const forgotPasswordTokenCtrl = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) throw new 'NO user found'();

	try {
		const token = await user.createPasswordResetToken();

		await user.save();

		const resetUrl = `If you were requested to reset your password, reset now  it within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">Click here to reset password</a>`;

		const msg = {
			to: email,
			from: 'shivbhonde34@gmail.com',
			subject: 'Reset password',
			html: resetUrl,
		};

		await sgMail.send(msg);

		res.json({
			message: `A verification message is send successfully to ${email}.Reset now within 10 min, ${resetUrl}`,
		});
	} catch (error) {
		res.json({ message: error.message });
	}

	// res.json('See if its working');
});

// -----------------------------------------------
// Password reset controller
// -----------------------------------------------

const passwrodResetCtrl = asyncHandler(async (req, res) => {
	const { resetToken, password } = req.body;

	const hashedToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	const user = await User.findOne({
		passwordRessetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) throw new Error('Token expired');

	user.password = password;
	user.passwordChangeAt = Date.now();
	user.passwordRessetToken = undefined;
	user.passwordResetExpires = undefined;

	await user.save();

	res.json('Password reset successful');
});

// -----------------------------------------------
// Profile photo upload
// -----------------------------------------------

const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
	const localPath = `public/images/profile/${req.file.filename}`;

	const uploadedImg = await cloudinaryUploadImage(localPath);

	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			profilePhoto: uploadedImg.url,
		},
		{ new: true }
	);
	// console.log(uploadedImg);
	res.json(updatedUser);

	fs.unlinkSync(localPath);
});

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUsersCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
	fetchUserProfileCtrl,
	updateUserProfileCtrl,
	updateUserPasswordCtrl,
	followingUserCtrl,
	unfollowUserCtrl,
	blockUserCtrl,
	unBlockUserCtrl,
	generateVerificationTokenCtrl,
	accountVerificationCrl,
	forgotPasswordTokenCtrl,
	passwrodResetCtrl,
	profilePhotoUploadCtrl,
};
