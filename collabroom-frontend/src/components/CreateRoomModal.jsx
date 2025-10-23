import { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateRoomModal({ isOpen, onClose, onSubmit }) {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!roomName.trim()) return;
    if (roomName.trim()) {
      onSubmit({ roomName: roomName.trim(), description: description.trim() });
      setRoomName('');
      setDescription('');
    }
  };

  const handleClose = () => {
    setRoomName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(38, 50, 56, 0.5)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl" style={{ backgroundColor: '#FFFFFF' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h2 className="text-2xl font-bold" style={{ color: '#263238' }}>Create New Room</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ backgroundColor: '#FAFAFA' }}
          >
            <X className="w-5 h-5" style={{ color: '#263238' }} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{ 
                borderColor: roomName ? '#59438E' : '#E5E7EB',
                color: '#263238'
              }}
              maxLength={50}
              required
            />
            <p className="text-xs mt-1 text-right" style={{ color: '#263238', opacity: 0.5 }}>
              {roomName.length}/50
            </p>
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project Description (Optional)"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
              style={{ 
                borderColor: description ? '#59438E' : '#E5E7EB',
                color: '#263238'
              }}
              maxLength={200}
            />
            <p className="text-xs mt-1 text-right" style={{ color: '#263238', opacity: 0.5 }}>
              {description.length}/200
            </p>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t" style={{ borderColor: '#E5E7EB' }}>
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
            disabled={!roomName.trim()}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all"
            style={{ 
              backgroundColor: roomName.trim() ? '#59438E' : '#E5E7EB',
              opacity: roomName.trim() ? 1 : 0.6,
              cursor: roomName.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}