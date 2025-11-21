'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Game<span className="text-blue-600">Battles</span>
              </span>
            </Link>
            {user && (
              <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
                <Link 
                  href="/matches" 
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Find Matches
                </Link>
                <Link 
                  href="/my-matches" 
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Matches
                </Link>
                <Link 
                  href="/create-match" 
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create Match
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>
              </div>
            )}
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-white hover:text-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs text-white">
                        {user.wins}W - {user.losses}L
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:text-gray-200 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile ({user.username}) - {user.wins}W - {user.losses}L
                </Link>
                <Link
                  href="/matches"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Find Matches
                </Link>
                <Link
                  href="/my-matches"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  My Matches
                </Link>
                <Link
                  href="/create-match"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Create Match
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Leaderboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-gray-800 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

