import asyncHandler from "express-async-handler";
import Category from "../models/categoryModal.js";
import Request from "../models/requestModel.js";
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Request
const deleteRequest = asyncHandler(async (req, res) => {
  const request123 = await Request.find({ user: req.params.id });
  console.log(request123[0]._id, "here");
  const request = await Request.findById(request123[0]._id);

  if (request) {
    await request.remove();
    res.json({ message: "Request removed" });
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});
const getRequest = asyncHandler(async (req, res) => {
  const users = await Request.find({});
  res.json(users);
});
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Request
const createRequest = asyncHandler(async (req, res) => {
  console.log(req.user._id);
  const category = new Request({
    user: req.user._id,
  });

  const createRequests = await category.save();
  res.status(201).json(createRequests);
});
const getRequetbyId = asyncHandler(async (req, res) => {
  const user = await Request.find({ user: req.user._id });
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

export { deleteRequest, createRequest, getRequest, getRequetbyId };
