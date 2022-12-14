import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  toggleLikePost,
  getTimelinePosts,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.put("/:id/like", toggleLikePost);
router.get("/:id/timeline", getTimelinePosts);

export default router;
