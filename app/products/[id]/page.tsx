import { notFound } from 'next/navigation';
import Image from 'next/image';
import { productsApi } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import AddToWishlistButton from '@/components/AddToWishlistButton';

interface ProductPageProps {
  params: { id: string };
}

export const revalidate = 60; // ISR

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const product = await productsApi.getProduct(parseInt(params.id, 10));
    return {
      title: `${product.name} - TechVault`,
      description: product.short_description?.replace(/<[^>]*>/g, '') || '',
    };
  } catch {
    return {
      title: 'Product Not Found - TechVault',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  let relatedProducts;

  try {
    product = await productsApi.getProduct(parseInt(params.id, 10));
    relatedProducts = await productsApi.getRelatedProducts(product.id, 4);
  } catch {
    notFound();
  }

  const mainImage = product.images.find((img) => img.is_main) || product.images[0];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/" className="text-primary-600 hover:underline">
              Home
            </a>
          </li>
          <li className="text-gray-400">/</li>
          {product.categories[0] && (
            <>
              <li>
                <a
                  href={`/?category=${product.categories[0].slug}`}
                  className="text-primary-600 hover:underline"
                >
                  {product.categories[0].name}
                </a>
              </li>
              <li className="text-gray-400">/</li>
            </>
          )}
          <li className="text-gray-600">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {mainImage?.src ? (
              <Image
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-500 cursor-pointer"
                >
                  <Image
                    src={image.thumbnail || image.src}
                    alt={image.alt || ''}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mb-6">
            {product.on_sale ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  ${product.sale_price}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ${product.regular_price}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  Sale
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.in_stock ? (
              <span className="inline-flex items-center text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center text-red-600">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div
              className="text-gray-600 mb-6 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!product.in_stock}
            >
              Add to Cart
            </button>
            <AddToWishlistButton productId={product.id} />
          </div>

          {/* Categories */}
          {product.categories.length > 0 && (
            <div className="border-t pt-6">
              <span className="text-gray-500">Categories: </span>
              {product.categories.map((cat, idx) => (
                <span key={cat.id}>
                  <a
                    href={`/?category=${cat.slug}`}
                    className="text-primary-600 hover:underline"
                  >
                    {cat.name}
                  </a>
                  {idx < product.categories.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}

          {/* SKU */}
          {product.sku && (
            <div className="mt-2">
              <span className="text-gray-500">SKU: </span>
              <span className="text-gray-700">{product.sku}</span>
            </div>
          )}
        </div>
      </div>

      {/* Full Description */}
      {product.description && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
