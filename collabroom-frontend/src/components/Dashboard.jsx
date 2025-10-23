import { useState } from 'react';
import { Plus, Users, CheckCircle, Clock, AlertCircle, LogOut, Bell, MessageSquare, Search } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { LogoutButton } from './LogoutButton';

export default function Dashboard() {
  const {user,loading} = useAuth();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms] = useState([
    { id: 1, name: 'Hackathon Project', members: 5, tasks: { todo: 8, inProgress: 3, done: 12 }, role: 'Leader' },
    { id: 2, name: 'Final Year Project', members: 4, tasks: { todo: 5, inProgress: 7, done: 20 }, role: 'Member' },
    { id: 3, name: 'Club Event Planning', members: 8, tasks: { todo: 12, inProgress: 2, done: 5 }, role: 'Leader' }
  ]);

  const [notifications] = useState([
    { id: 1, room: 'Hackathon Project', message: 'New task assigned: Design mockups', time: '5m ago', unread: true },
    { id: 2, room: 'Final Year Project', message: 'Task completed: Database schema', time: '1h ago', unread: true },
    { id: 3, room: 'Club Event Planning', message: 'Deadline approaching: Venue booking', time: '2h ago', unread: false }
  ]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAFA' }}>
      <nav className="shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#59438E' }}>
                <Users className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: '#263238' }}>CollabRoom</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors relative" style={{ backgroundColor: '#FAFAFA' }}>
                  <Bell className="w-5 h-5" style={{ color: '#263238' }} />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#3CB371' }}></span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: '#59438E', color: '#FFFFFF' }}>
                  {user.user.name.trim().split(" ").map(n => n[0].toUpperCase()).slice(0,2).join("")}
                </div>
                <LogoutButton/>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#263238' }}>Welcome back, {user.user.name}</h2>
          <p className="text-sm" style={{ color: '#263238', opacity: 0.6 }}>Manage your projects and collaborate with your team</p>
        </div>

        <div className="flex space-x-4 mb-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={() => setActiveTab('rooms')}
            className="pb-3 px-1 font-medium transition-colors relative"
            style={{ color: activeTab === 'rooms' ? '#59438E' : '#263238', opacity: activeTab === 'rooms' ? 1 : 0.6 }}
          >
            My Rooms
            {activeTab === 'rooms' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className="pb-3 px-1 font-medium transition-colors relative flex items-center space-x-2"
            style={{ color: activeTab === 'notifications' ? '#59438E' : '#263238', opacity: activeTab === 'notifications' ? 1 : 0.6 }}
          >
            <span>Notifications</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#3CB371', color: '#FFFFFF' }}>2</span>
            {activeTab === 'notifications' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button>
        </div>

        {activeTab === 'rooms' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#263238', opacity: 0.4 }} />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{ borderColor: '#E5E7EB', color: '#263238', backgroundColor: '#FFFFFF' }}
                />
              </div>
              <button className="ml-4 px-4 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 hover:opacity-90 transition-all" style={{ backgroundColor: '#59438E' }}>
                <Plus className="w-5 h-5" />
                <span>Create Room</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#263238' }}>{room.name}</h3>
                      <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: room.role === 'Leader' ? '#59438E' : '#3CB371', color: '#FFFFFF' }}>
                        {room.role}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ backgroundColor: '#FAFAFA' }}>
                      <MessageSquare className="w-5 h-5" style={{ color: '#263238' }} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-4 h-4" style={{ color: '#263238', opacity: 0.6 }} />
                    <span className="text-sm" style={{ color: '#263238', opacity: 0.6 }}>{room.members} members</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#263238', opacity: 0.4 }}></div>
                        <span className="text-sm" style={{ color: '#263238' }}>To Do</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#263238' }}>{room.tasks.todo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" style={{ color: '#D39B4B' }} />
                        <span className="text-sm" style={{ color: '#263238' }}>In Progress</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#D39B4B' }}>{room.tasks.inProgress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" style={{ color: '#3CB371' }} />
                        <span className="text-sm" style={{ color: '#263238' }}>Done</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#3CB371' }}>{room.tasks.done}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: '#3CB371',
                          width: `${(room.tasks.done / (room.tasks.todo + room.tasks.inProgress + room.tasks.done)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-right" style={{ color: '#263238', opacity: 0.6 }}>
                      {Math.round((room.tasks.done / (room.tasks.todo + room.tasks.inProgress + room.tasks.done)) * 100)}% Complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer flex items-start space-x-4"
                style={{ backgroundColor: notif.unread ? '#FFFFFF' : '#FAFAFA' }}
              >
                <div className="flex-shrink-0 mt-1">
                  {notif.unread ? (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3CB371' }}></div>
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E5E7EB' }}></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#59438E' }}>{notif.room}</span>
                    <span className="text-xs" style={{ color: '#263238', opacity: 0.5 }}>{notif.time}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#263238' }}>{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}