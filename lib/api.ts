import {
  ApiResponse,
  Product,
  ProductFilters,
  AuthResponse,
  Wishlist,
  WishlistIds,
  WishlistResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Token storage (client-side only)
let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('access_token');
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (refreshToken) return refreshToken;
  if (typeof window !== 'undefined') {
    refreshToken = localStorage.getItem('refresh_token');
  }
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || 'API request failed');
  }

  return data;
}

// Auth API
export const authApi = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.data) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    const token = getRefreshToken();
    if (!token) throw new Error('No refresh token');

    const response = await fetchApi<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: token }),
    });

    if (response.success && response.data) {
      setTokens(response.data.access_token, response.data.refresh_token);
    }

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  async me(): Promise<AuthResponse['user']> {
    const response = await fetchApi<AuthResponse['user']>('/auth/me');
    return response.data;
  },
};

// Products API
export const productsApi = {
  async getProducts(
    filters: ProductFilters = {}
  ): Promise<{ products: Product[]; meta: ApiResponse<Product[]>['meta'] }> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const query = params.toString();
    const endpoint = `/products${query ? `?${query}` : ''}`;

    const response = await fetchApi<Product[]>(endpoint);
    return { products: response.data, meta: response.meta };
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetchApi<Product>(`/products/${id}`);
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await fetchApi<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  async searchProducts(
    query: string,
    page = 1,
    perPage = 12
  ): Promise<{ products: Product[]; meta: ApiResponse<Product[]>['meta'] }> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      per_page: String(perPage),
    });

    const response = await fetchApi<Product[]>(`/products/search?${params}`);
    return { products: response.data, meta: response.meta };
  },

  async getRelatedProducts(productId: number, limit = 4): Promise<Product[]> {
    const response = await fetchApi<Product[]>(
      `/products/${productId}/related?limit=${limit}`
    );
    return response.data;
  },
};

// Wishlist API
export const wishlistApi = {
  async getWishlist(): Promise<Wishlist> {
    const response = await fetchApi<Wishlist>('/wishlist');
    return response.data;
  },

  async getWishlistIds(): Promise<WishlistIds> {
    const response = await fetchApi<WishlistIds>('/wishlist/ids');
    return response.data;
  },

  async addToWishlist(productId: number): Promise<WishlistResponse> {
    const response = await fetchApi<WishlistResponse>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
    return response.data;
  },

  async removeFromWishlist(productId: number): Promise<WishlistResponse> {
    const response = await fetchApi<WishlistResponse>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
    return response.data;
  },

  async clearWishlist(): Promise<{ success: boolean; message: string }> {
    const response = await fetchApi<{ success: boolean; message: string }>(
      '/wishlist/clear',
      { method: 'DELETE' }
    );
    return response.data;
  },

  async isInWishlist(
    productId: number
  ): Promise<{ product_id: number; in_wishlist: boolean }> {
    const response = await fetchApi<{
      product_id: number;
      in_wishlist: boolean;
    }>(`/wishlist/check/${productId}`);
    return response.data;
  },
};
