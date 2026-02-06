'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { wishlistApi, isAuthenticated } from '@/lib/api';

interface AddToWishlistButtonProps {
  productId: number;
}

export default function AddToWishlistButton({ productId }: AddToWishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      wishlistApi.isInWishlist(productId).then((data) => {
        setIsInWishlist(data.in_wishlist);
      }).catch(() => {
        setIsInWishlist(false);
      });
    }
  }, [productId]);

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        await wishlistApi.removeFromWishlist(productId);
        setIsInWishlist(false);
      } else {
        await wishlistApi.addToWishlist(productId);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`p-3 rounded-lg border-2 transition ${
        isInWishlist
          ? 'border-red-500 bg-red-50 text-red-500'
          : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
      } disabled:opacity-50`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={24}
        fill={isInWishlist ? 'currentColor' : 'none'}
        className={isLoading ? 'animate-pulse' : ''}
      />
    </button>
  );
}
