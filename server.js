const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./config/db/dbConnect');

dotenv.config();

const app = express();

// DB
dbConnect();

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT}`);
});
