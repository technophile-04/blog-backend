const asyncHandler = require('express-async-handler');
const User = require('../../model/user/User');
const generateToken = require('../../config/token/generateToken');
const validateMongoDbId = require('../../utils/validateMongoDbId');

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
		profilePhoto: user?.profilePhoto,
		isAdmin: user?.isAdmin,
		token: generateToken(user?._id),
	});
});

// -----------------------------------------------
// ALL USERS
// -----------------------------------------------

const fetchAllUsersCtrl = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({});
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

	validateMongoDbId(profileId);

	try {
		const userProfile = await User.findById(profileId);
		res.json(userProfile);
	} catch (error) {
		res.json({ message: error.message });
	}
});

// -----------------------------------------------
// update user profile
// -----------------------------------------------

const updateUserProfileCtrl = asyncHandler(async (req, res) => {
	// const { userId } = req.params;

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

	/*
		1)get the id from params
		2)validate id with the user set on req
	 */
});

module.exports = {
	userRegisterCtrl,
	userLoginCtrl,
	fetchAllUsersCtrl,
	deleteUserCtrl,
	fetchUserDetailsCtrl,
	fetchUserProfileCtrl,
	updateUserProfileCtrl,
};
