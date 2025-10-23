import mongoose from "mongoose";
import crypto from "crypto";

const room = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, 
    description: { type: String, trim: true },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    inviteCode: { type: String, unique: true },
  },
  { timestamps: true }
);

room.pre("save", async function (next) {
  if (this.inviteCode) return next();

  let unique = false;
  while (!unique) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    const existing = await mongoose.model("Room").findOne({ inviteCode: code });
    if (!existing) {
      this.inviteCode = code;
      unique = true;
    }
  }
  next();
});

const Room= mongoose.model('Room', room);
export default Room;
