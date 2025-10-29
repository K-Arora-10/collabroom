import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, MoreVertical, Send, Paperclip, CheckCircle, Clock, Circle, UserPlus, Copy, Check, Mail, X, Crown, Trash2 } from 'lucide-react';
import TeamMembers from './TeamMembers';
import TaskSection from './TaskSection';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../api/fetchClient';


export default function RoomPage() {
  const [activeSection, setActiveSection] = useState('tasks');
  const [newMessage, setNewMessage] = useState('');
  const [isLeader, setIsLeader] = useState(false);
  const [leader,setLeader] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [members, setMembers] = useState([]);

  const [room, setRoom] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await fetchWithAuth(`/api/rooms/room/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setRoom(data.room);
        setIsLeader(data.isLeader);
        setLeader(data.room.leader);
        setInviteCode(data.room.inviteCode);
        setMembers(data.room.members);
        console.log("Fetched room data:", data);
        } catch (err) { 
            console.error("Failed to fetch room data:", err);
        }
    };

    fetchRoomData();
  }, []);

  
  


  const [tasks] = useState({
    todo: [
      { id: 1, title: 'Design UI Mockups', assignee: 'Daksh Jain', priority: 'high' },
      { id: 2, title: 'Setup Database Schema', assignee: 'Jatin Kalra', priority: 'medium' },
      { id: 3, title: 'Write API Documentation', assignee: 'Manavjot Singh', priority: 'low' }
    ],
    inProgress: [
      { id: 4, title: 'Implement Authentication', assignee: 'Krish Arora', priority: 'high' },
      { id: 5, title: 'Design Landing Page', assignee: 'Daksh Jain', priority: 'medium' }
    ],
    done: [
      { id: 6, title: 'Project Setup', assignee: 'Krish Arora', priority: 'high' },
      { id: 7, title: 'Requirements Gathering', assignee: 'Manavjot Singh', priority: 'medium' }
    ]
  });

  const [messages] = useState([
    { id: 1, sender: 'Daksh Jain', message: 'Hey team! Just finished the UI mockups', time: '10:30 AM', initials: 'DJ' },
    { id: 2, sender: 'Krish Arora', message: 'Great work! Can you share them?', time: '10:32 AM', initials: 'KA' },
    { id: 3, sender: 'Jatin Kalra', message: 'Database schema is almost ready', time: '11:15 AM', initials: 'JK' }
  ]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#D39B4B';
      case 'low': return '#3CB371';
      default: return '#263238';
    }
  };

  const TaskCard = ({ task }) => (
    <div className="rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm" style={{ color: '#263238' }}>{task.title}</h4>
        <button className="p-1 rounded hover:bg-opacity-10" style={{ backgroundColor: '#FAFAFA' }}>
          <MoreVertical className="w-4 h-4" style={{ color: '#263238' }} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#263238', opacity: 0.6 }}>{task.assignee}</span>
        <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: getPriorityColor(task.priority), color: '#FFFFFF' }}>
          {task.priority}
        </span>
      </div>
    </div>
  );

  return (room &&
    <>
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <nav className="shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ backgroundColor: '#FAFAFA' }}>
                <ArrowLeft className="w-5 h-5" style={{ color: '#263238' }} />
              </button>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#263238' }}>{room.name}</h1>
                <p className="text-xs" style={{ color: '#263238', opacity: 0.6 }}>Team collaboration workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: room.role === 'Leader' ? '#59438E' : '#3CB371', color: '#FFFFFF' }}>
                {room.role}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl shadow-sm p-6 mb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: '#263238', opacity: 0.6 }}>Project Description</h3>
          <p className="text-sm" style={{ color: '#263238' }}>{room.description}</p>
        </div>

        <div className="flex space-x-4 mb-6 border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
          <button
            onClick={() => setActiveSection('tasks')}
            className="pb-3 px-4 font-medium transition-colors relative"
            style={{ color: activeSection === 'tasks' ? '#59438E' : '#263238', opacity: activeSection === 'tasks' ? 1 : 0.6 }}
          >
            Tasks
            {activeSection === 'tasks' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveSection('members')}
            className="pb-3 px-4 font-medium transition-colors relative"
            style={{ color: activeSection === 'members' ? '#59438E' : '#263238', opacity: activeSection === 'members' ? 1 : 0.6 }}
          >
            Members
            {activeSection === 'members' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveSection('chat')}
            className="pb-3 px-4 font-medium transition-colors relative"
            style={{ color: activeSection === 'chat' ? '#59438E' : '#263238', opacity: activeSection === 'chat' ? 1 : 0.6 }}
          >
            Chat
            {activeSection === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button>
        </div>

        {activeSection === 'tasks' && (
          <TaskSection isLeader={isLeader} members={members} roomId={id}/>
        )}

        {activeSection === 'members' && (
          <TeamMembers roomId={id} isLeaderprop={isLeader} membersProp={members} inviteCodeprop={inviteCode} leaderprop={leader}/>
        )}

        {activeSection === 'chat' && (
          <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="h-96 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#FAFAFA' }}>
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0" style={{ backgroundColor: '#59438E', color: '#FFFFFF' }}>
                    {msg.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-sm font-semibold" style={{ color: '#263238' }}>{msg.sender}</span>
                      <span className="text-xs" style={{ color: '#263238', opacity: 0.5 }}>{msg.time}</span>
                    </div>
                    <p className="text-sm rounded-lg p-3" style={{ backgroundColor: '#FFFFFF', color: '#263238' }}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ backgroundColor: '#FAFAFA' }}>
                  <Paperclip className="w-5 h-5" style={{ color: '#263238' }} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#E5E7EB', color: '#263238' }}
                />
                <button 
                  className="p-2 rounded-lg transition-all"
                  style={{ backgroundColor: newMessage.trim() ? '#59438E' : '#E5E7EB' }}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}