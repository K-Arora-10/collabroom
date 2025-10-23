import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  try {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" }); 
    }

    req.user = await User.findById(decoded.id).select("-password");
    next();
});
}catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
