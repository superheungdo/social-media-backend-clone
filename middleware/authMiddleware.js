import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const secret = process.env.SECRET_KEY;

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, secret);
      req.body._id = decoded?.id;

      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(403).json("Token is invalid!");
  }
};

export default authMiddleWare;
