import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { Plus, Circle, Clock, CheckCircle, MoreVertical } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { fetchWithAuth } from "../api/fetchClient";
import { useEffect } from "react";
import {useAuth} from "../context/AuthContext.jsx";

const TaskSection = ({ members, roomId, isLeader }) => {
  const {user}=useAuth();
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [tasks, setTasks] = useState({
    pending: [],
    inProgress: [],
    completed: [],
  });

  const [refreshTasks, setRefreshTasks] = useState(false);

  
  
  const onStatusChange = async (taskId, newStatus) => {
      try {
          const res = await fetchWithAuth(`/api/tasks/updateStatus/${taskId}`, {
            method: "PUT",  
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status: newStatus }),
        });   
            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to update task status");
                return;
            }
            const data = await res.json();
            setRefreshTasks(!refreshTasks);
            toast.success("Task status updated successfully!");
            
        } catch (err) {
            toast.error(err.message);
        }   
    };
    
    useEffect(() => {
      
      const fetchTasks = async () => {
        try {
          const res = await fetchWithAuth(`/api/tasks/getTasks/${roomId}`, {
            method: "GET",
            credentials: "include",
          });
          if (!res.ok) {
            toast.error(`HTTP error! status: ${res.message}`);
          }
          const data = await res.json();
          console.log("Fetched tasks:", data);
          setTasks({
            pending: data.tasks.filter((t) => t.status === "pending"),
            inProgress: data.tasks.filter((t) => t.status === "in-progress"),
            completed: data.tasks.filter((t) => t.status === "completed"),
          });
        } catch (err) {
          toast.error(`Failed to fetch tasks: ${err.message}`);
        }
      };
      fetchTasks();
    }, [showCreateTaskModal,refreshTasks]);

    

  const handleTaskCreation = async (newTask) => {
    console.log("New Task Created:", newTask);
    try {
      const res = await fetchWithAuth(`/api/tasks/createTask/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTask),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to create task");
        return;
      }
      const data = await res.json();
      toast.success("Task created successfully!");
      console.log("Create task response:", data);
    } catch (err) {
      toast.error(err.message);
    }
    setShowCreateTaskModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#D39B4B";
      case "low":
        return "#3CB371";
      default:
        return "#263238";
    }
  };

  const TaskCard = ({task}) => {
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'pending') return 'in-progress';
    if (currentStatus === 'in-progress') return 'completed';
    if (currentStatus === 'completed') return 'pending';
    
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#3CB371';
      case 'in-progress': return '#263238';
      case 'completed': return '#D39B4B';
      default: return '#263238';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Start';
      case 'in-progress': return 'Complete';
      case 'completed': return 'Done';
      default: return status;
    }
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <div
      className="rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm text-gray-900">{task.title}</h4>
        <button
          className="p-1 rounded hover:bg-opacity-10"
          style={{ backgroundColor: "#FAFAFA" }}
        >
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3 leading-snug">
        {task.description || 'No description'}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">
          {task.assignedTo.name}
        </span>
        
        {nextStatus && (user.user.email===task.assignedTo.email) && (
          <button
            onClick={() => {if(task.status==='completed')return
                else onStatusChange(task._id, nextStatus)}}
            className="px-2 py-1 rounded text-xs font-medium transition-all hover:opacity-80"
            style={{ 
              backgroundColor: getStatusColor(nextStatus),
              color: '#FFFFFF'
            }}
          >
            {getStatusLabel(task.status)} {task.status==='completed'?'':'→'}
          </button>
        )}
      </div>
    </div>
  );
};

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="flex justify-end mb-4">
        {isLeader && (<button
          onClick={() => {
            setShowCreateTaskModal(true);
          }}
          className="px-4 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 hover:opacity-90 transition-all"
          style={{ backgroundColor: "#59438E" }}
        >
          <Plus className="w-5 h-5" />
          <span>Create Task</span>
        </button>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Circle
              className="w-5 h-5"
              style={{ color: "#263238", opacity: 0.4 }}
            />
            <h3 className="font-semibold" style={{ color: "#263238" }}>
              To Do
            </h3>
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#a5aaac", color: "#FAFAFA" }}
            >
              {tasks.pending.length}
            </span>
          </div>
          <div>
            {tasks.pending.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: "#D39B4B" }} />
            <h3 className="font-semibold" style={{ color: "#263238" }}>
              In Progress
            </h3>
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#D39B4B", color: "#FFFFFF" }}
            >
              {tasks.inProgress.length}
            </span>
          </div>
          <div>
            {tasks.inProgress.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5" style={{ color: "#3CB371" }} />
            <h3 className="font-semibold" style={{ color: "#263238" }}>
              Completed
            </h3>
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "#3CB371", color: "#FFFFFF" }}
            >
              {tasks.completed.length}
            </span>
          </div>
          <div>
            {tasks.completed.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
      <CreateTaskModal
        onSubmit={handleTaskCreation}
        members={members}
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
      />
    </div>
  );
};

export default TaskSection;
