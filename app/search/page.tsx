import { productsApi } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search</h1>
        <p className="text-gray-600">Enter a search term to find products.</p>
      </div>
    );
  }

  const { products, meta } = await productsApi.searchProducts(query, page, 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 mt-2">
          {meta?.total || 0} products found
        </p>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          {meta && meta.total_pages > 1 && (
            <Pagination currentPage={meta.page} totalPages={meta.total_pages} />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found for "{query}"</p>
          <p className="text-gray-400 mt-2">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
