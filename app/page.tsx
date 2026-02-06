import { productsApi } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';

interface HomeProps {
  searchParams: {
    page?: string;
    category?: string;
    orderby?: string;
    order?: string;
    on_sale?: string;
  };
}

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function Home({ searchParams }: HomeProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const filters = {
    page,
    per_page: 12,
    category: searchParams.category,
    orderby: searchParams.orderby as any,
    order: searchParams.order as 'ASC' | 'DESC',
    on_sale: searchParams.on_sale === 'true' ? true : undefined,
  };

  const { products, meta } = await productsApi.getProducts(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-2">
          Discover our collection of {meta?.total || 0} products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              {meta && meta.total_pages > 1 && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.total_pages}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
