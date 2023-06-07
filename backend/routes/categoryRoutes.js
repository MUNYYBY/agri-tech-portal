import express from "express";
const router = express.Router();
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCatgory,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getCatgory).post(createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategory)
  .put(updateCategory);

export default router;
