import { useState, useEffect } from 'react';
import { X, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function CreateTaskModal({ isOpen, onClose, onSubmit, members }) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return () => (document.body.style.overflow = "auto");
}, [isOpen]);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    if (!taskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    if (!assignedTo) {
      setError('Please assign the task to a team member');
      return;
    }

    await onSubmit({
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      assignedTo,
      deadline: deadline || null,
      status: 'pending'
    });
    console.log("Done")

    handleClose();
  };

  const handleClose = () => {
    setTaskTitle('');
    setTaskDescription('');
    setAssignedTo('');
    setDeadline('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" 
      style={{ backgroundColor: 'rgba(38, 50, 56, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-lg rounded-2xl shadow-2xl my-8" 
        style={{ backgroundColor: '#FFFFFF' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#263238' }}>Create New Task</h2>
            <p className="text-xs mt-1" style={{ color: '#263238', opacity: 0.6 }}>
              Add a new task and assign it to a team member
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ backgroundColor: '#FAFAFA' }}
          >
            <X className="w-5 h-5" style={{ color: '#263238' }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ backgroundColor: '#fef2f2' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
              <p className="text-xs" style={{ color: '#ef4444' }}>
                {error}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#263238' }}>
              Task Title *
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors text-sm"
              style={{ 
                borderColor: taskTitle ? '#59438E' : '#E5E7EB',
                color: '#263238'
              }}
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#263238' }}>
              Description (Optional)
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add task description..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors resize-none text-sm"
              style={{ 
                borderColor: taskDescription ? '#59438E' : '#E5E7EB',
                color: '#263238'
              }}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: '#263238' }}>
                Assign To *
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors cursor-pointer text-sm"
                style={{ 
                  borderColor: assignedTo ? '#59438E' : '#E5E7EB',
                  color: assignedTo ? '#263238' : '#9CA3AF'
                }}
              >
                <option value="">Select team member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: '#263238' }}>
              Deadline (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#263238', opacity: 0.4 }} />
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border-2 focus:outline-none transition-colors text-sm"
                style={{ 
                  borderColor: deadline ? '#59438E' : '#E5E7EB',
                  color: '#263238'
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-5 border-t" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all border-2"
            style={{ 
              borderColor: '#E5E7EB',
              color: '#263238',
              backgroundColor: '#FAFAFA'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!taskTitle.trim() || !assignedTo}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: (taskTitle.trim() && assignedTo) ? '#59438E' : '#E5E7EB',
              opacity: (taskTitle.trim() && assignedTo) ? 1 : 0.6,
              cursor: (taskTitle.trim() && assignedTo) ? 'pointer' : 'not-allowed'
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}