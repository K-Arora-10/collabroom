import { useEffect, useState } from 'react';
import { UserPlus, Copy, Check, Mail, X, Crown, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../api/fetchClient';


export default function MembersSection({ roomId,isLeaderprop,membersProp, inviteCodeprop}) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteCode] = useState(inviteCodeprop);
  const [inviteLink] = useState(`https://collabroom.com/join/${inviteCode}`);
  const [members, setMembers] = useState(membersProp || []);
  const [isLeader,setIsLeader]= useState(isLeaderprop);



  

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMember = (memberId) => {
    console.log('Removing member:', memberId);
  };

//   if(error){
//     return <p>Error: {error}</p>;
//   }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#263238' }}>Team Members</h2>
          <p className="text-sm mt-1" style={{ color: '#263238', opacity: 0.6 }}>{members.length} members in this room</p>
        </div>
        {isLeader && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: '#59438E' }}
          >
            <UserPlus className="w-5 h-5" />
            <span>Invite Members</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map(member => (
          <div
            key={member._id}
            className="rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0"
                  style={{ backgroundColor: '#59438E', color: '#FFFFFF' }}
                >
                  {member.name.trim().split(" ").map(n => n[0].toUpperCase()).slice(0,2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold truncate" style={{ color: '#263238' }}>
                      {member.name}
                    </h3>
                    {member.role === 'Leader' && (
                      <Crown className="w-4 h-4 flex-shrink-0" style={{ color: '#D39B4B' }} />
                    )}
                  </div>
                  <p className="text-sm truncate" style={{ color: '#263238', opacity: 0.6 }}>
                    {member.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: member.role === 'Leader' ? '#59438E' : '#3CB371',
                        color: '#FFFFFF'
                      }}
                    >
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              {isLeader && member.role !== 'Leader' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors ml-2"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(38, 50, 56, 0.5)' }}
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-2xl font-bold" style={{ color: '#263238' }}>Invite Members</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                style={{ backgroundColor: '#FAFAFA' }}
              >
                <X className="w-5 h-5" style={{ color: '#263238' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#263238' }}>
                  Share Invite Code
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className="flex-1 px-4 py-3 rounded-lg font-mono text-lg font-bold text-center"
                    style={{ backgroundColor: '#FAFAFA', color: '#59438E' }}
                  >
                    {inviteCode}
                  </div>
                  <button
                    onClick={handleCopyInviteCode}
                    className="p-3 rounded-lg transition-all"
                    style={{ backgroundColor: copied ? '#3CB371' : '#59438E' }}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    ) : (
                      <Copy className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    )}
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#263238', opacity: 0.6 }}>
                  Share this code with your team members
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: '#E5E7EB' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-sm" style={{ backgroundColor: '#FFFFFF', color: '#263238', opacity: 0.6 }}>
                    Or
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3" style={{ color: '#263238' }}>
                  Share Invite Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg border-2 text-sm"
                    style={{ borderColor: '#E5E7EB', color: '#263238', backgroundColor: '#FAFAFA' }}
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="p-3 rounded-lg transition-all"
                    style={{ backgroundColor: copied ? '#3CB371' : '#59438E' }}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    ) : (
                      <Copy className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                    )}
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: '#263238', opacity: 0.6 }}>
                  Anyone with this link can join the room
                </p>
              </div>

              <div className="rounded-lg p-4" style={{ backgroundColor: '#FAFAFA' }}>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#59438E' }} />
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#263238' }}>
                      Pro Tip
                    </p>
                    <p className="text-xs" style={{ color: '#263238', opacity: 0.7 }}>
                      You can also send the invite code or link directly via email or messaging apps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t" style={{ borderColor: '#E5E7EB' }}>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#59438E' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}