const User = require('../../model/user/User');

const userRegisterCtrl = async (req, res) => {
	const userExist = await User.findOne({ email: req?.body?.email });

	if (userExist) {
		res.json({ message: 'User already exists' });
		return;
	}

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
};

module.exports = { userRegisterCtrl };
