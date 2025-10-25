import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LogIn, AlertCircle, Users, CheckCircle, Loader } from "lucide-react";
import { fetchWithAuth } from "../api/fetchClient";
import { ToastContainer,toast } from "react-toastify";

export default function JoinRoomPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchWithAuth(`/api/rooms/room/code/${inviteCode}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setRoom(data.room);
        console.log("Fetched room data:", data);
      } catch (err) {
        console.error("Failed to fetch room data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  const handleJoinRoom = async () => {
    setError("");
    setIsJoining(true);

    try {
      const res = await fetchWithAuth(`/api/rooms/join/${inviteCode}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
            if (!res.ok) {
              const errorData = await res.json();
              toast.error(errorData.message || 'Failed to join room');
               setIsJoining(false);
              return;
            }
      setSuccess(true);
      setIsJoining(false);

      setTimeout(() => {
        navigate(`/dashboard`);
      }, 1500);
    } catch (err) {
      setError("Failed to join room");
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
        
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FAFAFA" }}
      >
         <ToastContainer position="top-right" autoClose={3000} />
       
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{ backgroundColor: "#59438E" }}
          >
            <Loader
              className="w-8 h-8 animate-spin"
              style={{ color: "#FFFFFF" }}
            />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#263238" }}>
            Loading Room Info...
          </h2>
          <p className="text-sm" style={{ color: "#263238", opacity: 0.6 }}>
            Please wait while we verify your invite
          </p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: "#FAFAFA" }}
      >
         <ToastContainer position="top-right" autoClose={3000} />
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl shadow-lg p-8 text-center"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "#ef4444", opacity: 0.1 }}
            >
              <AlertCircle className="w-8 h-8" style={{ color: "#ef4444" }} />
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#263238" }}
            >
              Invalid Invite Link
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "#263238", opacity: 0.6 }}
            >
              This invite link is invalid or has expired. Please ask your team
              leader for a new link.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#59438E" }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#FAFAFA" }}
    >
         <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4"
            style={{ backgroundColor: "#59438E" }}
          >
            <Users className="w-8 h-8" style={{ color: "#FFFFFF" }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#263238" }}>
            You've Been Invited!
          </h1>
          <p className="text-sm" style={{ color: "#263238", opacity: 0.6 }}>
            Join your team and start collaborating
          </p>
        </div>

        {success ? (
          <div
            className="rounded-2xl shadow-lg p-12 text-center"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: "#3CB371" }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: "#FFFFFF" }} />
            </div>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: "#263238" }}
            >
              Welcome to the Team!
            </h3>
            <p
              className="text-sm mb-2"
              style={{ color: "#263238", opacity: 0.6 }}
            >
              You've successfully joined the room
            </p>
            <p className="text-xs" style={{ color: "#263238", opacity: 0.5 }}>
              Redirecting you now...
            </p>
          </div>
        ) : (
          <div
            className="rounded-2xl shadow-lg p-8"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#263238" }}>
                  {room?.name || "Room Name"}
                </h2>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: "#59438E", color: "#FFFFFF" }}
                >
                  Active Room
                </span>
              </div>
              <p
                className="text-sm mb-4"
                style={{ color: "#263238", opacity: 0.7 }}
              >
                {room?.description || "Room description will appear here"}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "#263238", opacity: 0.6 }}
                  >
                    Leader
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#263238" }}
                  >
                    {room?.leader.name || "Leader"}
                  </p>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "#263238", opacity: 0.6 }}
                  >
                    Members
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#263238" }}
                  >
                    {room?.members.length || 0} people
                  </p>
                </div>
                <div
                  className="text-center p-4 rounded-lg"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "#263238", opacity: 0.6 }}
                  >
                    Created
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#263238" }}
                  >
                    {new Date(room?.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "Recently"}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-lg p-4 mb-6"
              style={{
                backgroundColor: "#FAFAFA",
                borderLeft: "4px solid #59438E",
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#59438E" }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    i
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#263238" }}
                  >
                    What happens next?
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#263238", opacity: 0.7 }}
                  >
                    By joining this room, you'll be able to view and update
                    tasks, chat with team members, and collaborate on the
                    project. You'll be added as a team member.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleJoinRoom}
                disabled={isJoining}
                className="w-full py-4 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center space-x-2 hover:opacity-90"
                style={{
                  backgroundColor: isJoining ? "#E5E7EB" : "#59438E",
                  cursor: isJoining ? "not-allowed" : "pointer",
                }}
              >
                {isJoining ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Joining Room...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Join Room</span>
                  </>
                )}
              </button>

              <p
                className="text-xs text-center"
                style={{ color: "#263238", opacity: 0.5 }}
              >
                Invite Code:{" "}
                <span
                  className="font-mono font-semibold"
                  style={{ color: "#59438E" }}
                >
                  {inviteCode}
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium hover:underline"
            style={{ color: "#59438E" }}
          >
            Already have an account? Go to Dashboard
          </button>
        </div>

        <div
          className="mt-4 text-center text-xs"
          style={{ color: "#263238", opacity: 0.5 }}
        >
          <p>© 2025 CollabRoom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
