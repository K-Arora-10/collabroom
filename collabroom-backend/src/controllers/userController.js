import User from "../models/user.model.js";
import {sendEmail} from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
// import { Resend } from 'resend';


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
    const html = (name, verify) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - CollabRoom</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="background-color: #000000; padding: 40px 40px 30px 40px; text-align: center;">
                  <div style="background-color: #000000; display: inline-block; padding: 0;">
                    <h1 style="color: #ffffff; font-size: 42px; font-weight: 700; margin: 0; letter-spacing: 2px; text-transform: uppercase;">COLLAB</h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 50px 40px;">
                  <h2 style="color: #000000; font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Hi ${name},</h2>
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Welcome to <strong>CollabRoom</strong>! 🎉
                  </p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    We're excited to have you on board. To get started, please verify your email address by clicking the button below:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0 30px 0;">
                        <a href="${verify}" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
                          VERIFY EMAIL
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                    Or copy and paste this link in your browser:
                  </p>
                  <p style="background-color: #f5f5f5; padding: 12px; border-radius: 6px; word-break: break-all; margin: 0 0 20px 0;">
                    <a href="${verify}" style="color: #000000; font-size: 13px; text-decoration: none;">${verify}</a>
                  </p>
                  <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
                    <p style="color: #999999; font-size: 13px; line-height: 1.5; margin: 0;">
                      ⏱️ This link will expire in <strong>1 hour</strong> for security reasons.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9f9f9; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0 0 10px 0;">
                    If you didn't create an account with CollabRoom, you can safely ignore this email.
                  </p>
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} CollabRoom. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // const resend = new Resend(process.env.RESEND_API_KEY);
    console.log("Sending verification email to:", email);

    // await resend.emails.send({
    //   from: 'collabroom.team@gmail.com',
    //   to: email,
    //   subject: 'Verify your email - CollabRoom',
    //   html
    // });


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








