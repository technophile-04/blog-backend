const User = require('../../model/user/User');

const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');

/* 
1)check if headers is present
2)check if authorization is present
3)Grab token from authorization
4)Decode the token
5)find the user by id
6)attach the user to request
*/

const authMiddleware = asyncHandler(async (req, res, next) => {
	if (req?.headers?.authorization?.startsWith('Bearer')) {
		try {
			const token = req.headers.authorization.split(' ')[1];

			if (token) {
				const decode = jwt.verify(token, process.env.JWT_KEY);

				// -password meaning deselect this attribute
				const user = await User.findById(decode.id).select('-password');

				req.user = user;
				next();
			} else {
				throw new Error('There is no token attached to the headers');
			}
		} catch (error) {
			throw new Error('The token is invalid, please login again');
		}
	} else {
		throw new Error('No token attached to the headers');
	}
});

module.exports = authMiddleware;
