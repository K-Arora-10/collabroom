import { compare } from "bcryptjs";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const createRoom = async (req, res) => {
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ message: "Room name is required" });
  try {
    const room = new Room({
      name,
      description,
      leader: req.user,
      members: [req.user],
    });
    await room.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { rooms: room },
    });
    res
      .status(201)
      .json({
        message: "Room created successfully",
        invitecode: room.inviteCode,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const displayAllRooms = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate({
      path: "rooms",
      select: "_id name description leader inviteCode",
      populate: {
        path: "leader",
        select: "name",
      },
    });

    res.status(200).json({ rooms: user.rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const joinRoom = async (req, res) => {
  const userId = req.user._id;
  const { inviteCode } = req.params;
  try {
    const room = await Room.findOne({ inviteCode });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const isMember = room.members.includes(userId);
    if (isMember) {
      return res.status(400).json({ message: "User already a member of the room" });
    }
    room.members.push(userId);
    await room.save();
    await User.findByIdAndUpdate(userId, {
      $push: { rooms: room },
    });
    res.status(200).json({ message: "Joined room successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
