import User from "../models/user.model.js";
import {sendEmail} from "../utils/sendEmail.js";


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
