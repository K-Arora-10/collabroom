import mongoose from "mongoose";
const room = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, 
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
    inviteCode: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const Room= mongoose.model('Room', room);
export default Room;
