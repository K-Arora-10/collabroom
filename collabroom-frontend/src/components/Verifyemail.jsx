import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Check } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function VerifyEmailPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/verify/${token}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setVerified(true);
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token) handleVerify(); 
  // }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAFAFA' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {verified ? (
        <div className="w-full max-w-md rounded-lg shadow-lg p-8 text-center" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Check size={32} style={{ color: '#3CB371' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#263238' }}>Email Verified!</h1>
          <p className="text-sm" style={{ color: '#7A8A99' }}>Your email has been successfully verified.</p>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-lg shadow-lg p-8" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#59438E' }}>
              <Mail size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#263238' }}>Verify Email</h1>
            <p className="text-sm" style={{ color: '#7A8A99' }}>Your email is being verified...</p>
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#59438E' }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      )}
    </div>
  );
}
