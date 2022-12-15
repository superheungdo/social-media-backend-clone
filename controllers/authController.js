import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/userModel.js";

// Registering a new User
export const registerUser = async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    const alreadyExist = await UserModel.findOne({ username });

    if (alreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      firstname,
      lastname,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token, user });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
