import { useState } from 'react';
import { X, LogIn, AlertCircle } from 'lucide-react';

export default function JoinRoomModal({ isOpen, onClose, onSubmitJoin }) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }

    if (inviteCode.trim().length < 8) {
      setError('Invite code must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onSubmitJoin(inviteCode.trim().toUpperCase());
      setInviteCode('');
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setInviteCode('');
    setError('');
    onClose();
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInviteCode(value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(38, 50, 56, 0.5)' }}
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl" 
        style={{ backgroundColor: '#FFFFFF' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#263238' }}>Join Room</h2>
            <p className="text-sm mt-1" style={{ color: '#263238', opacity: 0.6 }}>
              Enter the invite code to join a project room
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

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3" style={{ color: '#263238' }}>
              Invite Code
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={handleInputChange}
              placeholder="Enter invite code (e.g., ABC123XY)"
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors font-mono text-lg text-center tracking-wider"
              style={{ 
                borderColor: error ? '#ef4444' : (inviteCode ? '#59438E' : '#E5E7EB'),
                color: '#263238'
              }}
              maxLength={20}
              disabled={isLoading}
            />
            {error && (
              <div className="flex items-center space-x-2 mt-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                <p className="text-sm" style={{ color: '#ef4444' }}>
                  {error}
                </p>
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: '#263238', opacity: 0.6 }}>
              Ask your team leader for the invite code
            </p>
          </div>

          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#FAFAFA' }}>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#59438E' }}>
                <LogIn className="w-4 h-4" style={{ color: '#FFFFFF' }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#263238' }}>
                  How to join
                </p>
                <ul className="text-xs space-y-1" style={{ color: '#263238', opacity: 0.7 }}>
                  <li>• Get the invite code from your team leader</li>
                  <li>• Enter the code in the field above</li>
                  <li>• Click "Join Room" to start collaborating</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 p-6 border-t" style={{ borderColor: '#E5E7EB' }}>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all border-2"
            style={{ 
              borderColor: '#E5E7EB',
              color: '#263238',
              backgroundColor: '#FAFAFA',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!inviteCode.trim() || isLoading}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: (inviteCode.trim() && !isLoading) ? '#59438E' : '#E5E7EB',
              opacity: (inviteCode.trim() && !isLoading) ? 1 : 0.6,
              cursor: (inviteCode.trim() && !isLoading) ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Join Room</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}