const asyncHandler = require('express-async-handler');
const Category = require('../../model/Category/Category');
const validateMongoDbId = require('../../utils/validateMongoDbId');

// -----------------------------------------------
// Create a category
// -----------------------------------------------

const createCategoryCtrl = asyncHandler(async (req, res) => {
	try {
		const category = await Category.create({
			user: req.user._id,
			title: req.body.title,
		});

		res.json(category);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// -----------------------------------------------
// Fetch all categories
// -----------------------------------------------

const fetchAllCategoriesCtrl = asyncHandler(async (req, res) => {
	try {
		const categories = await Category.find({})
			.populate('user')
			.sort('-createdAt');
		res.json(categories);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// -----------------------------------------------
// Update a category
// -----------------------------------------------

const fetchCategoryCtrl = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;

	validateMongoDbId(categoryId);

	try {
		const category = await Category.findById(categoryId).populate('user');
		res.json(category);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// -----------------------------------------------
// Fetch a category
// -----------------------------------------------

const updateCategoryCtrl = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;

	validateMongoDbId(categoryId);

	try {
		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			{
				title: req.body.title,
			},
			{ new: true, runValidators: true }
		);

		res.json(updatedCategory);
	} catch (error) {
		res.json({ error: error.message });
	}
});

// -----------------------------------------------
// delete a category
// -----------------------------------------------

const deleteCategoryCtrl = asyncHandler(async (req, res) => {
	const { categoryId } = req.params;
	validateMongoDbId(categoryId);
	try {
		await Category.findByIdAndDelete(categoryId);

		res.json({ message: 'Category deleted successfully' });
	} catch (error) {
		res.json({ error: error.message });
	}
});

module.exports = {
	createCategoryCtrl,
	fetchAllCategoriesCtrl,
	fetchCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
};
