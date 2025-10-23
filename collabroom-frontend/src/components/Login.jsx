import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

export default function LoginPage() {

  const navigate = useNavigate();

    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
        toast.error('Please fill all fields');
        return;
    }

    try{
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || 'Login failed');
            return;
        }
        toast.success('Login successful!');
        const profileRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/protected`, { credentials: "include" });
        if (profileRes.ok) {
          console.log("Navigating to dashboard",profileRes);
          navigate("/dashboard");
        }
        
    }
    catch(err){
        toast.error(err.message);
    }

    
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
    <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#263238' }}>
            Welcome Back
          </h1>
          <p className="text-sm" style={{ color: '#263238', opacity: 0.6 }}>
            Sign in to continue to your dashboard
          </p>
        </div>

        <div className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5" style={{ color: '#59438E', opacity: 0.5 }} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-opacity-100 transition-colors"
                style={{ 
                  borderColor: email ? '#59438E' : '#E5E7EB',
                  color: '#263238'
                }}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5" style={{ color: '#59438E', opacity: 0.5 }} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-opacity-100 transition-colors"
                style={{ 
                  borderColor: password ? '#59438E' : '#E5E7EB',
                  color: '#263238'
                }}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: '#263238', opacity: 0.5 }} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: '#263238', opacity: 0.5 }} />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                {/* <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ 
                    accentColor: '#3CB371'
                  }}
                />
                <span className="ml-2 text-sm" style={{ color: '#263238' }}>
                  Remember me
                </span> */}
              </label>
              {/* <a 
                href="#" 
                className="text-sm font-medium hover:underline"
                style={{ color: '#59438E' }}
              >
                Forgot password?
              </a> */}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: '#59438E' }}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs" style={{ color: '#263238', opacity: 0.5 }}>
          <p>© 2025 CollabRoom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}