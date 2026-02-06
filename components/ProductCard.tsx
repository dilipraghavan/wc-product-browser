import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.is_main) || product.images[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
    >
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
          {product.featured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.categories[0] && (
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            {product.categories[0].name}
          </span>
        )}

        {/* Name */}
        <h3 className="font-medium text-gray-900 mt-1 group-hover:text-primary-600 transition line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
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

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(parseFloat(product.average_rating))
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating_count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
