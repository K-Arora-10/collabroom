import Room from "../models/room.model.js";

export const getRoomInfo = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const room = await Room.findById(roomId)
      .populate("members leader", "_id name email")
      .populate({
        path: "chat",
        populate: { path: "sender", select: "_id name email" },
        options: { sort: { time: 1 } },
      });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // console.log("Room fetched:", room);
    res
      .status(200)
      .json({
        room,
        isLeader: room.leader._id.toString() === req.user._id.toString(),
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getRoomMembers = async (req, res) => {
//   const roomId = req.params.roomId;
//     try {
//         const room = await Room.findById(roomId).select('members leaders').populate('members leader', '_id name email');
//         console.log("Room fetched:", room);
//         if (!room) {
//             return res.status(404).json({ message: 'Room not found' });
//         }
//         res.status(200).json({ members: room.members , isLeader: room.leader._id.toString() === req.user._id.toString() });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const roomInfoByInviteCode = async (req, res) => {
  const userId = req.user._id;
  const { inviteCode } = req.params;
  try {
    const room = await Room.findOne({ inviteCode }).populate(
      "members leader",
      "_id name email"
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
