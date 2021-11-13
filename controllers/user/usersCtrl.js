const asyncHandler = require('express-async-handler');
const User = require('../../model/user/User');

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

	res.json('User logged in');
});

module.exports = { userRegisterCtrl, userLoginCtrl };
