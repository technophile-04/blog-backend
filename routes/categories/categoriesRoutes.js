const express = require('express');
const {
	createCategoryCtrl,
	fetchAllCategoriesCtrl,
	fetchCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
} = require('../../controllers/category/categoryCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const categoriesRoute = express.Router();

categoriesRoute.post('/', authMiddleware, createCategoryCtrl);
categoriesRoute.get('/', fetchAllCategoriesCtrl);
categoriesRoute.get('/:categoryId', authMiddleware, fetchCategoryCtrl);
categoriesRoute.put('/:categoryId', authMiddleware, updateCategoryCtrl);
categoriesRoute.delete('/:categoryId', authMiddleware, deleteCategoryCtrl);

module.exports = categoriesRoute;
