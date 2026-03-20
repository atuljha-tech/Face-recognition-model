'use client';

import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Login from '@/components/Login';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                {/* Animated spinner */}
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl animate-pulse">👤</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium mt-4">Loading FaceRecog</p>
              <p className="text-sm text-gray-400 mt-1">Preparing your experience...</p>
              
              {/* Animated dots */}
              <div className="flex justify-center space-x-1 mt-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Login onLoginSuccess={() => setIsAuthenticated(true)} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        
        {/* Optional: Add a subtle gradient overlay */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-t from-transparent to-purple-50/5"></div>
      </body>
    </html>
  );
}