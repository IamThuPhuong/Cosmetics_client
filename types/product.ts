export interface BrandResponse {
  id: number;
  name: string;
  origin?: string;
  logoUrl?: string;
}

export interface CategoryResponse {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductImageResponse {
  id: number;
  imageUrl: string;
  isMain: boolean;
}

export interface ProductVariantResponse {
  id: number;
  sku: string;
  variantName: string;
  shadeColor?: string;
  capacity?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  barcode?: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface ProductSummaryResponse {
  id: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  name: string;
  slug: string;
  brandName?: string;
  categoryName?: string;
  minPrice: number;
  maxPrice?: number;
  inStock?: boolean;
  status?: boolean;
  isActive?: boolean;
  isFeatured: boolean;
}

export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  category?: CategoryResponse;
  brand?: BrandResponse;
  description?: string;
  suitableSkinType?: string;
  ingredients?: string;
  usageInstructions?: string;
  pao?: string;
  isActive: boolean;
  isFeatured: boolean;
  productVariantResponses: ProductVariantResponse[];
  variants?: any[];
  productImages: ProductImageResponse[];
  minPrice?: number;
  thumbnailUrl?: string;
}

export type ProductSortBy =
  | "NEWEST"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "NAME_ASC"
  | "NAME_DESC"
  | "POPULAR";

export interface ProductFilterParams {
  keyword?: string;
  categoryId?: string | number;
  brandId?: string | number;
  minPrice?: number;
  maxPrice?: number;
  suitableSkinType?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sortBy?: ProductSortBy;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}
