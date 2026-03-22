'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, sendOTP, verifyOTP } from '@/utils/api';

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await loginUser(username, password);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_role', response.role);
      localStorage.setItem('username', response.username);
      
      setCookie('access_token', response.access_token);
      setCookie('user_role', response.role);
      
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await sendOTP(phone);
      setGeneratedOtp(response.otp);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await verifyOTP(phone, otp);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user_role', response.role);
      localStorage.setItem('phone', response.phone);
      
      setCookie('access_token', response.access_token);
      setCookie('user_role', response.role);
      
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex bg-white/10 rounded-xl p-1 mb-8">
          <button
            onClick={() => { setIsAdmin(true); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${isAdmin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Admin Login
          </button>
          <button
            onClick={() => { setIsAdmin(false); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isAdmin ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            User Login
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
          {isAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Admin username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Password"
                  required
                />
              </div>
              {error && <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Admin Login'}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Any phone number (e.g., 9876543210)"
                  disabled={otpSent}
                />
                <p className="text-xs text-gray-400 mt-1">✨ Demo: Any phone number works</p>
              </div>
              
              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !phone}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <>
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 text-center">
                    <p className="text-purple-200 text-sm">Demo Mode</p>
                    <p className="text-white text-lg font-bold mt-1">{generatedOtp}</p>
                    <p className="text-purple-200 text-xs mt-1">Use this OTP to login</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="6-digit OTP"
                    />
                    <p className="text-xs text-gray-400 mt-1">✨ Any 6-digit number works for demo</p>
                  </div>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </>
              )}
              {error && <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm">{error}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}