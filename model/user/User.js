const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// To save the Hashed password we use middleware provided by mongoose and that dont use arrow function coz we want to reference the schema
// Hashed password
userSchema.pre('save', async function (next) {
	// console.log(this);
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);

	next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

//Compile schema into model
const User = mongoose.model('User', userSchema);

module.exports = User;
