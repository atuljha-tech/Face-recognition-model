'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to clear cookie
const clearCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    const name = localStorage.getItem('username') || localStorage.getItem('phone');
    setUserRole(role);
    setUsername(name);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    localStorage.removeItem('phone');
    clearCookie('access_token');
    clearCookie('user_role');
    clearCookie('username');
    router.push('/login');
  };

  const adminNavItems = [
    { name: 'Quick Start', href: '/quick-start', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { name: 'Live Recognition', href: '/', icon: '🎥', gradient: 'from-green-500 to-teal-500' },
    { name: 'Register', href: '/register', icon: '📝', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊', gradient: 'from-purple-500 to-pink-500' },
  ];

  const userNavItems = [
    { name: 'Live Recognition', href: '/', icon: '🎥', gradient: 'from-green-500 to-teal-500' },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

  if (pathname === '/login') return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
            : 'bg-white/80 backdrop-blur-md border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link
              href={userRole === 'admin' ? '/dashboard' : '/'}
              className="group relative flex items-center space-x-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  FaceRecog
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">
                  AI-Powered Recognition
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {pathname === item.href && (
                    <motion.div
                      layoutId="active-nav"
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl shadow-md`}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-gray-50/80 backdrop-blur-sm">
                  {userRole === 'admin' ? (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">👑</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {username}
                        </span>
                        <span className="text-xs text-purple-600">Administrator</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">📱</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {username}
                        </span>
                        <span className="text-xs text-blue-600">User</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="group relative px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-50 rounded-xl transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="text-base">🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </span>
              </motion.button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-1.5">
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        pathname === item.href
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                      {pathname === item.href && (
                        <motion.div
                          layoutId="active-mobile"
                          className="ml-auto"
                        >
                          <span className="text-sm">→</span>
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile User Info */}
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-3">
                      {userRole === 'admin' ? (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-lg">👑</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{username}</p>
                            <p className="text-xs text-purple-600">Administrator</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-lg">📱</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{username}</p>
                            <p className="text-xs text-blue-600">User</p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}