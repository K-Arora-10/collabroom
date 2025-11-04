import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, MoreVertical, Send, Paperclip, CheckCircle, Clock, Circle, UserPlus, Copy, Check, Mail, X, Crown, Trash2 } from 'lucide-react';
import TeamMembers from './TeamMembers';
import TaskSection from './TaskSection';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../api/fetchClient';
import ChatSection from './ChatSection';


export default function RoomPage() {
  const [activeSection, setActiveSection] = useState('tasks');
  
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

  
  

  

  // const getPriorityColor = (priority) => {
  //   switch(priority) {
  //     case 'high': return '#ef4444';
  //     case 'medium': return '#D39B4B';
  //     case 'low': return '#3CB371';
  //     default: return '#263238';
  //   }
  // };

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
          <ChatSection roomId={id} prevChat={room.chat}/>
        )}
      </div>
    </div>
    </>
  );
}