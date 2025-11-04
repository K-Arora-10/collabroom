import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { fetchWithAuth } from "../api/fetchClient";

const ChatSection = ({ roomId, prevChat }) => {
  const [messages, setMessages] = useState(prevChat || []);
  const [newMessage, setNewMessage] = useState("");
  const endOfMessagesRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addNewMessage = async () => {
    if (!newMessage.trim()) return;

    const msgData = {
      roomId,
      message: newMessage.trim(),
      time: new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      {
        ...msgData,
        sender: { name: "You" },
      },
    ]);
    setNewMessage("");

    try {
      const res = await fetchWithAuth(`/api/chat/send/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData),
      });
      if (!res.ok) {
        console.error(await res.json());
      }
      console.log("Message sent successfully");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="h-96 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: "#FAFAFA" }}>
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0"
              style={{ backgroundColor: "#59438E", color: "#FFFFFF" }}
            >
              {msg.sender?.name ? msg.sender.name[0].toUpperCase() : "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="text-sm font-semibold" style={{ color: "#263238" }}>
                  {msg.sender?.name || "Unknown"}
                </span>
                <span className="text-xs" style={{ color: "#263238", opacity: 0.5 }}>
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm rounded-lg p-3" style={{ backgroundColor: "#FFFFFF", color: "#263238" }}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 border-t" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center space-x-2">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") addNewMessage();
            }}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
            style={{ borderColor: "#E5E7EB", color: "#263238" }}
          />
          <button
            onClick={addNewMessage}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: newMessage.trim() ? "#59438E" : "#E5E7EB",
            }}
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" style={{ color: "#FFFFFF" }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
