import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const user = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, required: true, minlength: 6 },
  rooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
      },
    ],
  tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  },
  { timestamps: true }
);


user.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

user.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

user.methods.generateVerificationToken = function() {
    const token = crypto.randomBytes(20).toString('hex');
    this.verificationToken = token;
    this.verificationExpires = Date.now() + 3600000;
    return token;
}

const User = mongoose.model("User", user);
export default User;

