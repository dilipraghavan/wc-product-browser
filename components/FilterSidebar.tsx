'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { slug: 'accessories', name: 'Accessories' },
  { slug: 'clothing', name: 'Clothing' },
  { slug: 'decor', name: 'Decor' },
  { slug: 'hoodies', name: 'Hoodies' },
  { slug: 'music', name: 'Music' },
  { slug: 'tshirts', name: 'T-shirts' },
];

const SORT_OPTIONS = [
  { value: 'date-DESC', label: 'Newest' },
  { value: 'date-ASC', label: 'Oldest' },
  { value: 'price-ASC', label: 'Price: Low to High' },
  { value: 'price-DESC', label: 'Price: High to Low' },
  { value: 'title-ASC', label: 'Name: A-Z' },
  { value: 'title-DESC', label: 'Name: Z-A' },
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSort = `${searchParams.get('orderby') || 'date'}-${
    searchParams.get('order') || 'DESC'
  }`;
  const onSale = searchParams.get('on_sale') === 'true';

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category || null });
  };

  const handleSortChange = (sortValue: string) => {
    const [orderby, order] = sortValue.split('-');
    updateFilters({ orderby, order });
  };

  const handleSaleToggle = () => {
    updateFilters({ on_sale: onSale ? null : 'true' });
  };

  const clearFilters = () => {
    router.push('/');
  };

  const hasFilters = currentCategory || onSale || currentSort !== 'date-DESC';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={currentCategory === ''}
              onChange={() => handleCategoryChange('')}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-gray-600">All Categories</span>
          </label>
          {CATEGORIES.map((category) => (
            <label key={category.slug} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={currentCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* On Sale */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={onSale}
            onChange={handleSaleToggle}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="ml-2 text-gray-600">On Sale Only</span>
        </label>
      </div>
    </div>
  );
}
