import User from "../models/user.model.js";
import {sendEmail} from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";


export const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }   
    const user = new User({ name, email, password });
    const token= await user.generateVerificationToken();
    console.log(token);
    await user.save();

    const verify = `${process.env.FRONTEND_URL}/verify/${token}`;
    const html = `
      <p>Hi ${name},</p>
      <p>Welcome to CollabRoom 🎉</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verify}">${verify}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    console.log("Sending verification email to:", email);

    await sendEmail({
      to: email,
      subject: "Verify your email - CollabRoom",
      html,
    });

    res.status(200).json({ message: "Verification email sent to " + email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const verifyEmail = async (req, res) => {    
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verificationToken: token,   
            verificationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });


export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    })
      .json({ message: "Token refreshed" });
  } catch {
    return res.status(403).json({ message: "Refresh failed" });
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////






export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({ message: "Email not verified" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const protectedRoute = async (req, res) => {
  try {
    res.status(200).json({user: req.user});
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}





export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    const decoded = jwt.decode(refreshToken);
    if (decoded?.id) {
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
  }

  res.status(200)
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logged out successfully" });
};








