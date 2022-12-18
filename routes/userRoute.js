import express from "express";

import authMiddleWare from "../middleware/AuthMiddleware.js";
import {
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUsers);

router.put("/:id", authMiddleWare, updateUser);
router.delete("/:id", authMiddleWare, deleteUser);
router.put("/:id/follow", authMiddleWare, followUser);
router.put("/:id/unfollow", authMiddleWare, unfollowUser);

export default router;
