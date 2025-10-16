import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMatch && Object.values(formData).every((field) => field)) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  return (
    <div
      style={{ backgroundColor: '#FAFAFA' }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div
        style={{ backgroundColor: '#FFFFFF' }}
        className="w-full max-w-md rounded-lg shadow-lg p-8"
      >
        <div className="mb-8 text-center">
          <div
            style={{ backgroundColor: '#59438E' }}
            className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <h1 style={{ color: '#263238' }} className="text-3xl font-bold mb-2">
            Create Account
          </h1>
          <p style={{ color: '#7A8A99' }} className="text-sm">
            Join us today and get started
          </p>
        </div>

        {submitted && (
          <div
            style={{ backgroundColor: '#E8F5E9', borderLeft: '4px solid #3CB371' }}
            className="mb-6 p-4 rounded flex items-center gap-3"
          >
            <Check size={20} style={{ color: '#3CB371' }} />
            <span style={{ color: '#2E7D32' }} className="text-sm font-medium">
              Account created successfully!
            </span>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={{
                borderColor: '#E0E0E0',
                backgroundColor: '#FAFAFA',
                color: '#263238',
              }}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition"
              onFocus={(e) => (e.target.style.borderColor = '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              style={{
                borderColor: '#E0E0E0',
                backgroundColor: '#FAFAFA',
                color: '#263238',
              }}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition"
              onFocus={(e) => (e.target.style.borderColor = '#59438E')}
              onBlur={(e) => (e.target.style.borderColor = '#E0E0E0')}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  borderColor: '#E0E0E0',
                  backgroundColor: '#FAFAFA',
                  color: '#263238',
                }}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition"
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
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  borderColor: !passwordMatch ? '#E53935' : '#E0E0E0',
                  backgroundColor: '#FAFAFA',
                  color: '#263238',
                }}
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition"
                onFocus={(e) =>
                  (e.target.style.borderColor = !passwordMatch ? '#E53935' : '#59438E')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = !passwordMatch ? '#E53935' : '#E0E0E0')
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#7A8A99' }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!passwordMatch && formData.confirmPassword && (
              <p style={{ color: '#E53935' }} className="text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            style={{ backgroundColor: '#59438E' }}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition mt-6"
          >
            Create Account
          </button>

          <p style={{ color: '#7A8A99' }} className="text-center text-sm mt-4">
            Already have an account?{' '}
            <span style={{ color: '#3CB371' }} className="font-semibold cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}