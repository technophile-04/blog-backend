const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnect = require('./config/db/dbConnect');
const userRoutes = require('./routes/users/usersRoutes');
const postRoutes = require('./routes/posts/postRoutes');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');
const commentRoutes = require('./routes/comments/commentRoutes');
const emailMessagesRoutes = require('./routes/emailMessages/emailMessagesRoutes');
const categoriesRoute = require('./routes/categories/categoriesRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

// DB
dbConnect();

app.use(express.json());
app.use(morgan('short'));
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sendEmail', emailMessagesRoutes);
app.use('/api/categories', categoriesRoute);

// error handler
app.use(notFound);
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is up and running on ${PORT}`);
});
