import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'confirmPassword' || name === 'password') {
      const pwd = name === 'password' ? value : formData.password;
      const confirm = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMatch(pwd === confirm || confirm === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(import.meta.env.VITE_BACKEND_URL)

    if (!Object.values(formData).every((field) => field)) {
      toast.error('Please fill all fields');
      return;
    }

    if (!passwordMatch) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Registration failed');
        return;
      }

      toast.success('An email has been sent to you. Please verify your email.');

      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setPasswordMatch(true);
      setShowPassword(false);
      setShowConfirmPassword(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to server. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md rounded-lg shadow-lg p-8" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#263238' }}>Create Account</h1>
          <p className="text-sm" style={{ color: '#7A8A99' }}>Join us today and get started</p>
        </div>

        <div className="space-y-5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition"
              style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA', color: '#263238' }}
              onFocus={(e) => (e.target.style.borderColor = '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition"
              style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA', color: '#263238' }}
              onFocus={(e) => (e.target.style.borderColor = '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition"
              style={{ borderColor: '#E0E0E0', backgroundColor: '#FAFAFA', color: '#263238' }}
              onFocus={(e) => (e.target.style.borderColor = '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: '#7A8A99' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition"
              style={{ borderColor: !passwordMatch ? '#E53935' : '#E0E0E0', backgroundColor: '#FAFAFA', color: '#263238' }}
              onFocus={(e) => (e.target.style.borderColor = !passwordMatch ? '#E53935' : '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = !passwordMatch ? '#E53935' : '#E0E0E0')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: '#7A8A99' }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {!passwordMatch && formData.confirmPassword && (
              <p className="text-xs mt-1" style={{ color: '#E53935' }}>Passwords do not match</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition mt-6"
            style={{ backgroundColor: '#59438E' }}
          >
            Create Account
          </button>

          <p className="text-center text-sm mt-4" style={{ color: '#7A8A99' }}>
            Already have an account?{' '}
            <Link to='/login'>
              <span className="font-semibold cursor-pointer hover:underline" style={{ color: '#3CB371' }}>
                Sign in
              </span>
            </Link>
            
          </p>
        </div>
      </div>
    </div>
  );
}
