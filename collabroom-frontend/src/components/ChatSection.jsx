import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { fetchWithAuth } from "../api/fetchClient";
import { socket } from "../socket.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ChatSection = ({ roomId, prevChat }) => {
  const [messages, setMessages] = useState(prevChat || []);
  const [newMessage, setNewMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addNewMessage = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      roomId,
      message: newMessage.trim(),
      time: new Date().toISOString(),
      socketId: socket.id,
    };

    setMessages((prev) => [...prev, { ...msgData, sender: { email: user.user.email, name: user.user.name } }]);
    setNewMessage("");

    try {
      await fetchWithAuth(`/api/chat/send/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden border border-gray-100" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Messages Container - Enhanced scrollbar and spacing */}
      <div 
        className="h-96 overflow-y-auto p-6 space-y-4" 
        style={{ 
          backgroundColor: "#F8F9FA",
          scrollbarWidth: "thin",
          scrollbarColor: "#D1D5DB #F8F9FA"
        }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMine = msg.sender?.email === user?.user?.email;

          return (
            <div
              key={index}
              className={`flex items-start space-x-3 ${isMine ? "justify-end" : ""} animate-fadeIn`}
              style={{
                animation: "fadeIn 0.3s ease-in"
              }}
            >
              {/* Avatar for other users */}
              {!isMine && (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 shadow-md"
                  style={{ 
                    backgroundColor: "#59438E",
                    color: "#FFFFFF",
                    border: "2px solid #FFFFFF"
                  }}
                >
                  {msg.sender?.name ? msg.sender.name[0].toUpperCase() : "?"}
                </div>
              )}

              <div className={`flex-1 max-w-md ${isMine ? "flex flex-col items-end" : ""}`}>
                {/* Message header with name and time */}
                <div className={`flex items-baseline space-x-2 mb-1.5 ${isMine ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <span className="text-sm font-semibold" style={{ color: "#263238" }}>
                    {isMine ? "You" : msg.sender?.name || "Unknown"}
                  </span>
                  <span className="text-xs" style={{ color: "#6B7280" }}>
                    {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Message bubble with enhanced styling */}
                <div
                  className="text-sm rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: isMine ? "#7C3AED" : "#FFFFFF",
                    color: isMine ? "#FFFFFF" : "#263238",
                    borderBottomRightRadius: isMine ? "4px" : "16px",
                    borderBottomLeftRadius: isMine ? "16px" : "4px",
                    maxWidth: "100%",
                    wordBreak: "break-word"
                  }}
                >
                  {msg.message}
                </div>
              </div>

              {/* Avatar for current user */}
              {isMine && (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 shadow-md"
                  style={{ 
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                    border: "2px solid #FFFFFF"
                  }}
                >
                  {user?.user?.name ? user.user.name[0].toUpperCase() : "Y"}
                </div>
              )}
            </div>
          );
        })}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Section - Enhanced with better focus states */}
      <div className="p-4 border-t bg-white" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center space-x-3">
          <input
            onKeyDown={(e) => e.key === "Enter" && addNewMessage()}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none transition-all"
            style={{ 
              borderColor: "#E5E7EB",
              color: "#263238",
              backgroundColor: "#F9FAFB"
            }}
            onFocus={(e) => e.target.style.borderColor = "#7C3AED"}
            onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
          />
          <button
            onClick={addNewMessage}
            className="p-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              backgroundColor: newMessage.trim() ? "#7C3AED" : "#E5E7EB",
              color: "#FFFFFF"
            }}
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatSection;