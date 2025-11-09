import Chat from "../models/chat.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  const { message, time, socketId } = req.body;
    const  sender  = req.user._id;
    console.log("Sender ID:", req.user._id);
  const roomId = req.params.roomId;

  if (!message || !sender || !time) {
    return res.status(400).json({ message: "All fields are required",message,sender,time });
  }

  try {
    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const newChat = new Chat({
      roomId,
      sender,
      message,
      time,
    });
    await newChat.save();

    const room = await Room.findById(roomId);
    if (room) {
      room.chat.push(newChat._id);
      await room.save();
    }

    const io = req.app.get("io");
    console.log("Emitting message to room:", roomId, { message, time, sender: { name: senderUser.name } });
    io.to(roomId).except(socketId).emit("receiveMessage", {
      roomId,
      message,
      time,
      sender: { name: req.user.name }
    });

    res.status(201).json({ message: "Message sent successfully", chat: newChat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

