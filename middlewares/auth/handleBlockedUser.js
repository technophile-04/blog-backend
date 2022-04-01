const User = require('../../model/user/User');
const asyncHandler = require('express-async-handler');

const handleBlockedUser = asyncHandler(async (req, res, next) => {
	const user = req.user;
	console.log('fdafasf', user.isBlocked);

	if (user.isBlocked) {
		throw new Error(`Access denied, You are blocked!`);
	} else {
		next();
	}
});

module.exports = handleBlockedUser;
