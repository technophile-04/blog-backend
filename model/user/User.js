const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

//create schema
const userSchema = new mongoose.Schema(
	{
		firstName: {
			required: [true, 'First name is required'],
			type: String,
		},
		lastName: {
			required: [true, 'Last name is required'],
			type: String,
		},
		profilePhoto: {
			type: String,
			default:
				'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
		},
		bio: {
			type: String,
			default: '',
		},
		password: {
			type: String,
			required: [true, 'Hey buddy Password is required'],
		},
		postCount: {
			type: Number,
			default: 0,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ['Admin', 'Guest', 'Blogger'],
		},
		isFollowing: {
			type: Boolean,
			default: false,
		},
		isUnFollowing: {
			type: Boolean,
			default: false,
		},
		isAccountVerified: { type: Boolean, default: false },
		accountVerificationToken: String,
		accountVerificationTokenExpires: Date,

		viewedBy: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},

		followers: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		following: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
		},
		passwordChangeAt: Date,
		passwordRessetToken: String,
		passwordResetExpires: Date,

		active: {
			type: Boolean,
			default: false,
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

// Virtual method to populate created Posts
userSchema.virtual('posts', {
	ref: 'Post',
	foreignField: 'user',
	localField: '_id',
});

userSchema.virtual('accountType').get(function () {
	const totalFollowers = this.followers?.length;
	if (totalFollowers < 3) {
		return 'Starter Account';
	} else {
		return 'Pro Account';
	}
});

// To save the Hashed password we use middleware provided by mongoose and that dont use arrow function coz we want to reference the schema
// Hashed password
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	// console.log(this);
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Verify account password useing mail
userSchema.methods.createAccountVerificationToken = async function () {
	const verificationToken = crypto.randomBytes(32).toString('hex');

	this.accountVerificationToken = crypto
		.createHash('sha256')
		.update(verificationToken)
		.digest('hex');

	this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000; // 10 minutes

	return verificationToken;
};

userSchema.methods.createPasswordResetToken = async function () {
	const verification = crypto.randomBytes(32).toString('hex');

	this.passwordRessetToken = crypto
		.createHash('sha256')
		.update(verification)
		.digest('hex');

	this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes

	return verification;
};

//Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
