'use client';

import { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { authApi, isAuthenticated, clearTokens } from '@/lib/api';
import { User as UserType } from '@/lib/types';

export default function AccountPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      authApi.me().then((userData) => {
        setUser(userData);
      }).catch(() => {
        setUser(null);
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      clearTokens();
    }
    window.location.href = '/';
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account</h1>
        <p className="text-gray-600 mb-6">Please log in to view your account.</p>
        <a
          href="/login"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
        >
          Log In
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="font-semibold text-gray-900">
              {user?.display_name || user?.username}
            </h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
