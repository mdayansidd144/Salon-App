import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const API_BASE = 'http://localhost:5000';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectUser = (user) => {
    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'groomer') {
      navigate('/groomer-dashboard');
    } else {
      navigate('/'); // Customers go to home page
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.name}!`);
        redirectUser(data.user);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome, ${data.user.name}!`);
        redirectUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="bg-[#151515] border border-gray-800 rounded-3xl w-full max-w-md p-10 shadow-2xl">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to continue to Cut For You</p>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Login Failed')}
            theme="filled_black"
            shape="pill"
            text="signin_with"
          />
        </div>

        <div className="relative flex py-4 items-center mb-6">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or use email</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-gold py-3 mt-4 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;