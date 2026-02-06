'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { isAuthenticated, wishlistApi } from '@/lib/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    
    if (isAuthenticated()) {
      wishlistApi.getWishlistIds().then((data) => {
        setWishlistCount(data.count);
      }).catch(() => {
        setWishlistCount(0);
      });
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            TechVault
          </Link>

          {/* Search - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/wishlist"
              className="relative text-gray-600 hover:text-primary-600 transition"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="text-gray-600 hover:text-primary-600 transition"
            >
              <ShoppingCart size={24} />
            </Link>
            <Link
              href={isLoggedIn ? '/account' : '/login'}
              className="text-gray-600 hover:text-primary-600 transition"
            >
              <User size={24} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            <nav className="flex flex-col gap-4">
              <Link
                href="/wishlist"
                className="flex items-center gap-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart size={20} />
                Wishlist ({wishlistCount})
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart size={20} />
                Cart
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/login'}
                className="flex items-center gap-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                {isLoggedIn ? 'Account' : 'Login'}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
