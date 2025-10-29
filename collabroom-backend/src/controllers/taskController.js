import Task from '../models/task.model.js';
import Room from '../models/room.model.js';
import User from '../models/user.model.js';


export const createTask = async(req,res) => {
    
    const { title, description, assignedTo, deadline, status } = req.body;
    const assignedToEmail=assignedTo.match(/\(([^)]+)\)/)?.[1];
    console.log("Assigned to email extracted:", assignedToEmail);

    const roomId = req.params.roomId;

    if (!title) {
        return res.status(400).json({ message: "Task title is required" });
    }   
    try {
        const assignedTo = await User.findOne({email: assignedToEmail});
        const newTask = new Task({
            title,
            description,
            status,
            assignedTo,
            room: roomId,
            deadline,
        });
        await newTask.save();

        const room = await Room.findById(roomId);
        room.tasks.push(newTask);
        await room.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


export const getTasksByRoom = async (req, res) => {
    const roomId = req.params.roomId;
    try {
        const tasks = await Task.find({ room: roomId }).populate('assignedTo', 'name email');
        if (!tasks) {
            return res.status(404).json({ message: 'No tasks found for this room' });
        }
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.status = status;
        await task.save();
        res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};