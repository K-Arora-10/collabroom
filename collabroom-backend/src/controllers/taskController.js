import Task from '../models/task.model.js';
import Room from '../models/room.model.js';
import User from '../models/user.model.js';
import {sendEmail} from '../utils/sendEmail.js';


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

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Task Assigned</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td style="background-color: #1a1a1a; padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                         New Task Assigned
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: #e0e0e0; font-size: 14px;">
                                        CollabRoom
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                        Hello,
                                    </p>
                                    <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                        You have been assigned a new task in <strong>${room?.name || 'your room'}</strong>.
                                    </p>
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 30px;">
                                        <tr>
                                            <td style="padding: 25px;">
                                                <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                                                    ${title}
                                                </h2>
                                                
                                                <div style="margin-bottom: 15px;">
                                                    <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                        Description
                                                    </p>
                                                    <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">
                                                        ${description || 'No description provided'}
                                                    </p>
                                                </div>
                                                
                                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                                                    <tr>
                                                        <td width="50%" style="padding-right: 10px;">
                                                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                                Status
                                                            </p>
                                                            <span style="display: inline-block; padding: 6px 14px; background-color: ${status === 'completed' ? '#2d2d2d' : status === 'in-progress' ? '#666666' : '#1a1a1a'}; color: #ffffff; border-radius: 20px; font-size: 13px; font-weight: 500;">
                                                                ${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                                            </span>
                                                        </td>
                                                        <td width="50%" style="padding-left: 10px;">
                                                            <p style="margin: 0 0 5px 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                                                Deadline
                                                            </p>
                                                            <p style="margin: 0; color: #333333; font-size: 15px; font-weight: 500;">
                                                                ${deadline ? new Date(deadline).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'No deadline'}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td align="center" style="padding: 10px 0 20px 0;">
                                                <a href="${process.env.FRONTEND_URL}/room/${roomId}" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                                                    View Task Details
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 20px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                                        If you have any questions about this task, please reach out to your team members in the room.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                        CollabRoom
                                    </p>
                                    <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                        This is an automated notification. Please do not reply to this email.
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `

        await sendEmail({
              to: assignedToEmail,
              subject: "Task Assigned - CollabRoom",
              html,
          });

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