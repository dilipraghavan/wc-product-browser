'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, X } from 'lucide-react';
import { wishlistApi, isAuthenticated } from '@/lib/api';
import { Product } from '@/lib/types';

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

  const handleRemoveItem = async (productId: number) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      setProducts(products.filter(p => p.id !== productId));
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      try {
        await wishlistApi.clearWishlist();
        setProducts([]);
        window.dispatchEvent(new CustomEvent('wishlist-updated'));
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const mainImage = product.images.find((img) => img.is_main) || product.images[0];
            return (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm relative group">
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveItem(product.id)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                  aria-label="Remove from wishlist"
                >
                  <X size={20} className="text-red-500" />
                </button>

                <Link href={`/products/${product.id}`}>
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {mainImage?.src ? (
                      <Image
                        src={mainImage.thumbnail || mainImage.src}
                        alt={mainImage.alt || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.on_sale && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Sale
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2">
                      {product.on_sale ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-600">${product.sale_price}</span>
                          <span className="text-sm text-gray-400 line-through">
                            ${product.regular_price}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-gray-900">${product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
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
