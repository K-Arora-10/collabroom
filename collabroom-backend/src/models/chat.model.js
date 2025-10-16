import mongoose from "mongoose";

const chat = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Chat", chat);
