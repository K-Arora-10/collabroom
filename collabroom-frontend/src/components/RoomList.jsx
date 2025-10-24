import { useEffect, useState } from "react";
import { CheckCircle, Clock, MessageSquare, Users } from "lucide-react";
import { fetchWithAuth } from "../api/fetchClient";
import { useNavigate } from "react-router-dom";


const RoomsList = ({rooms,loading,error}) => {
 
  const navigate = useNavigate();

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div onClick={() => navigate(`/room/${room._id}`)} key={room._id} className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: '#FFFFFF' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#263238' }}>{room.name}</h3>
                      <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: room.role === 'Leader' ? '#59438E' : '#3CB371', color: '#FFFFFF' }}>
                        {room.leader.name}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-opacity-10 transition-colors" style={{ backgroundColor: '#FAFAFA' }}>
                      <MessageSquare className="w-5 h-5" style={{ color: '#263238' }} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-4 h-4" style={{ color: '#263238', opacity: 0.6 }} />
                    <span className="text-sm" style={{ color: '#263238', opacity: 0.6 }}>{room.description}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {/* <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#263238', opacity: 0.4 }}></div> */}
                        <span className="text-sm" style={{ color: '#263238' }}>Invite Code - {room.inviteCode}</span>
                      </div>
                      {/* <span className="text-sm font-semibold" style={{ color: '#263238' }}>{room.tasks.todo}</span> */}
                    </div>
                    {/* <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" style={{ color: '#D39B4B' }} />
                        <span className="text-sm" style={{ color: '#263238' }}>In Progress</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#D39B4B' }}>{room.tasks.inProgress}</span>
                    </div> */}
                    {/* <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" style={{ color: '#3CB371' }} />
                        <span className="text-sm" style={{ color: '#263238' }}>Done</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#3CB371' }}>{room.tasks.done}</span>
                    </div> */}
                  </div>

                  {/* <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E5E7EB' }}>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: '#3CB371',
                        //   width: `${(room.tasks.done / (room.tasks.todo + room.tasks.inProgress + room.tasks.done)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 text-right" style={{ color: '#263238', opacity: 0.6 }}>
                      {Math.round((room.tasks.done / (room.tasks.todo + room.tasks.inProgress + room.tasks.done)) * 100)}% Complete
                    </p>
                  </div> */}
                </div>
              ))}
            </div>
      )}
    </div>
  );
};

export default RoomsList;
