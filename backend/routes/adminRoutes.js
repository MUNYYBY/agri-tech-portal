import express from "express";
const router = express.Router();
import {
  createRequest,
  deleteRequest,
  getRequest,
  getRequetbyId,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getRequest).post(protect, createRequest);
router.route("/:id").delete(protect, deleteRequest);
router.route("/me").get(protect, getRequetbyId);

export default router;
