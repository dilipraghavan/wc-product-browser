'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { wishlistApi, isAuthenticated } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductGrid from '@/components/ProductGrid';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      loadWishlist();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getWishlist();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      try {
        await wishlistApi.clearWishlist();
        setProducts([]);
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-600 mb-6">Please log in to view your wishlist.</p>
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
        <p className="text-gray-600 mt-4">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-1">{products.length} items</p>
        </div>
        {products.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 size={20} />
            Clear All
          </button>
        )}
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
          <p className="text-gray-400 mt-2">
            Browse products and add your favorites here.
          </p>
          <a
            href="/"
            className="inline-block mt-6 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Browse Products
          </a>
        </div>
      )}
    </div>
  );
}
