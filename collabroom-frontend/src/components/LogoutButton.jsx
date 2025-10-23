import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const LogoutButton = () => {
    const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, { 
        method: "POST",
        credentials: "include",
      });
        if (res.ok) {  
            navigate("/login");
        }
    } catch (err) {
      console.error("Logout failed:", err);
    }
    };

  return (
    <button
    onClick={handleLogout}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer px-3 py-2 rounded-lg transition-all flex items-center space-x-2"
      style={{ backgroundColor: isHovered ? '#ef4444' : '#FAFAFA' }}
    >
      <LogOut className="w-5 h-5" style={{ color: isHovered ? '#FFFFFF' : '#263238' }} />
      <span className="text-sm font-medium" style={{ color: isHovered ? '#FFFFFF' : '#263238' }}>Logout</span>
    </button>
  );
};