import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// Get a user
export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();

    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;

      return otherDetails;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id: myId, currentUserAdminStatus, password } = req.body;

  if (id === myId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access denied! You can only update your own profile");
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { _id: myId, currentUserAdminStatus } = req.body;

  if (myId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access denied! You can only delete your own profile");
  }
};

// Follow a user
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { _id: myId } = req.body;

  if (myId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(myId);

      if (!followUser.followers.includes(myId)) {
        await followUser.updateOne({ $push: { followers: myId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("User is already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const id = req.params.id;

  const { _id: myId } = req.body;

  if (myId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(myId);

      if (followUser.followers.includes(myId)) {
        await followUser.updateOne({ $pull: { followers: myId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
