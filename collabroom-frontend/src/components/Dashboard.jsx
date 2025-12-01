import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Bell,
  MessageSquare,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LogoutButton } from "./LogoutButton";
import CreateRoomModal from "./CreateRoomModal";
import { toast, ToastContainer } from "react-toastify";
import RoomsList from "./RoomList";
import { fetchWithAuth } from "../api/fetchClient";
import JoinRoomModal from "./JoinRoomModal";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("rooms");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [rooms, setRooms] = useState([]);
  const [looading, setLooading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetchWithAuth(`/api/rooms/displayRooms`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setRooms(data.rooms);
      } catch (err) {
        setError(err.message);
      } finally {
        setLooading(false);
      }
    };

    fetchRooms();
  }, [isCreateModalOpen, isJoinModalOpen]);

  const handleJoinRoom = async (inviteCode) => {
    try {
      const res = await fetchWithAuth(`/api/rooms/join/${inviteCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to join room");
        return;
      }
      const data = await res.json();
      toast.success("Joined room successfully!");
      console.log("Join room response:", data);
      setRooms((prevRooms) => [...prevRooms, data.room]);
    } catch (err) {
      toast.error(err.message);
    }
    setIsJoinModalOpen(false);
  };

  const handleCreateRoom = async ({ roomName, description }) => {
    try {
      const res = await fetchWithAuth(`/api/rooms/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: roomName, description }),
      });

      if (!res.ok) {
        toast.error("Failed to create room");
        return;
      }

      const data = await res.json();
      toast.success("Room created successfully!");
      console.log("Create room response:", data);
    } catch (err) {
      toast.error(err.message);
    }
    setIsCreateModalOpen(false);
  };

  const [notifications] = useState([
    {
      id: 1,
      room: "Hackathon Project",
      message: "New task assigned: Design mockups",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      room: "Final Year Project",
      message: "Task completed: Database schema",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      room: "Club Event Planning",
      message: "Deadline approaching: Venue booking",
      time: "2h ago",
      unread: false,
    },
  ]);

  const filteredRooms = rooms.filter(room =>
  room.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="shadow-sm" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#59438E" }}
              >
                <Users className="w-6 h-6" style={{ color: "#FFFFFF" }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#263238" }}>
                CollabRoom
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="p-2 rounded-lg hover:bg-opacity-10 transition-colors relative"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  {/* <Bell className="w-5 h-5" style={{ color: "#263238" }} />
                  <span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#3CB371" }}
                  ></span> */}
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
                  style={{ backgroundColor: "#59438E", color: "#FFFFFF" }}
                >
                  {user.user.name
                    .trim()
                    .split(" ")
                    .map((n) => n[0].toUpperCase())
                    .slice(0, 2)
                    .join("")}
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: "#263238" }}>
            Welcome back, {user.user.name}
          </h2>
          <p className="text-sm" style={{ color: "#263238", opacity: 0.6 }}>
            Manage your projects and collaborate with your team
          </p>
        </div>

        <div
          className="flex space-x-4 mb-6 border-b"
          style={{ borderColor: "#E5E7EB" }}
        >
          <button
            onClick={() => setActiveTab("rooms")}
            className="pb-3 px-1 font-medium transition-colors relative"
            style={{
              color: activeTab === "rooms" ? "#59438E" : "#263238",
              opacity: activeTab === "rooms" ? 1 : 0.6,
            }}
          >
            My Rooms
            {activeTab === "rooms" && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: "#59438E" }}
              ></div>
            )}
          </button>
          {/* <button
            onClick={() => setActiveTab('notifications')}
            className="pb-3 px-1 font-medium transition-colors relative flex items-center space-x-2"
            style={{ color: activeTab === 'notifications' ? '#59438E' : '#263238', opacity: activeTab === 'notifications' ? 1 : 0.6 }}
          >
            <span>Notifications</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#3CB371', color: '#FFFFFF' }}>2</span>
            {activeTab === 'notifications' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#59438E' }}></div>
            )}
          </button> */}
        </div>

        {activeTab === "rooms" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: "#263238", opacity: 0.4 }}
                />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{
                    borderColor: "#E5E7EB",
                    color: "#263238",
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-4 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#59438E" }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Join Room</span>
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-lg font-semibold text-white flex items-center space-x-2 hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#59438E" }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Room</span>
                </button>
              </div>
            </div>

            <RoomsList rooms={filteredRooms} loading={looading} error={error} />
          </>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer flex items-start space-x-4"
                style={{
                  backgroundColor: notif.unread ? "#FFFFFF" : "#FAFAFA",
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  {notif.unread ? (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#3CB371" }}
                    ></div>
                  ) : (
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#E5E7EB" }}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#59438E" }}
                    >
                      {notif.room}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "#263238", opacity: 0.5 }}
                    >
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#263238" }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoom}
      />
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmitJoin={handleJoinRoom}
      />
    </div>
  );
}
