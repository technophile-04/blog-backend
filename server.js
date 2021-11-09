const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db/dbConnect');
const { userRegisterCtrl } = require('./controllers/user/usersCtrl');

dotenv.config();

const app = express();

// DB
dbConnect();

app.use(express.json());

// Register
app.post('/api/users/register', userRegisterCtrl);

// Login
app.post('/api/users/login', (req, res) => {
	res.json({
		user: 'User is login',
	});
});

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT}`);
});
