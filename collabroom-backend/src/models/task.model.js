import mongoose from "mongoose";

const task = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    assignedTo: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },  
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    deadline: { type: Date}
    }, 
    {timestamps: true}
);

export default mongoose.model("Task", task);