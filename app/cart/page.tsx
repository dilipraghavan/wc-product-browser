import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
      <p className="text-gray-600 mb-6">
        Cart functionality is not included in this demo.
      </p>
      <p className="text-gray-500 text-sm mb-6">
        This project focuses on demonstrating headless WooCommerce architecture,
        JWT authentication, and wishlist functionality.
      </p>
      <a
        href="/"
        className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition"
      >
        Browse Products
      </a>
    </div>
  );
}
