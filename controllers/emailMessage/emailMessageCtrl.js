const asyncHandler = require('express-async-handler');
const sgMail = require('@sendgrid/mail');
const EmailMessage = require('../../model/EmailMessaging/EmailMessaging');
const Filter = require('bad-words');

const sendEmailMessageCtrl = asyncHandler(async (req, res) => {
	const { to, subject, message } = req.body;

	const emailMessage = subject + ' ' + message;

	const filter = new Filter();

	const isProfane = filter.isProfane(emailMessage);

	if (isProfane)
		throw new Error('Email sent failed because it contains profane workds');

	try {
		const msg = {
			to,
			subject,
			text: message,
			from: 'shivbhonde34@gmail.com',
		};

		await sgMail.send(msg);

		await EmailMessage.create({
			sentBy: req.user?._id,
			fromEmail: req.user?.email,
			toEmail: to,
			subject,
			message,
		});

		res.json({ message: 'Mail sent' });
	} catch (error) {
		res.json({ message: error.message });
	}
});

module.exports = { sendEmailMessageCtrl };
