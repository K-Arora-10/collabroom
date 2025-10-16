import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
  },
  { timestamps: true }
);


user.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

user.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", user);
export default User;

