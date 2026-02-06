// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: PaginationMeta | null;
  errors: ApiError[] | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  featured: boolean;
  stock_status: string;
  stock_quantity: number | null;
  in_stock: boolean;
  short_description: string;
  description?: string;
  categories: Category[];
  tags: Tag[];
  images: ProductImage[];
  average_rating: string;
  rating_count: number;
  date_created: string;
  attributes?: ProductAttribute[];
  default_attributes?: Record<string, string>;
  gallery_images?: ProductImage[];
  related_ids?: number[];
  variations?: ProductVariation[];
  variation_attributes?: Record<string, string[]>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  src: string;
  thumbnail: string;
  medium: string;
  alt: string;
  is_main: boolean;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: AttributeOption[] | string[];
}

export interface AttributeOption {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  in_stock: boolean;
  stock_quantity: number | null;
  attributes: Record<string, string>;
  image: ProductImage;
}

// Auth types
export interface User {
  id: number;
  email: string;
  username: string;
  display_name: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  roles: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

// Wishlist types
export interface Wishlist {
  products: Product[];
  count: number;
}

export interface WishlistIds {
  product_ids: number[];
  count: number;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  wishlist?: Wishlist;
}

// Filter types
export interface ProductFilters {
  page?: number;
  per_page?: number;
  category?: string;
  orderby?: 'date' | 'price' | 'popularity' | 'rating' | 'title' | 'menu_order';
  order?: 'ASC' | 'DESC';
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  on_sale?: boolean;
}
