import asyncHandler from "express-async-handler";
import Category from "../models/categoryModal.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getCatgory = asyncHandler(async (req, res) => {
  const pageSize = 100;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Category.countDocuments({ ...keyword });
  const c = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  const categories = c.filter((v) => v._id != "618e8b2791eb0776a817f7b5");
  res.json({ categories, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const product = await Category.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    name: "Sample name",

    image: "/images/sample.jpg",
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name;

    category.image = image;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getCatgory,
  getCategoryById,
  deleteCategory,
  createCategory,
  updateCategory,
};
