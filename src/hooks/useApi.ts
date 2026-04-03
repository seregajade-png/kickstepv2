import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ApiProduct, ApiBrand, ApiCategory, ApiBanner, ApiSiteConfig, ApiFilters } from '../lib/api';

// ─── Brands (cached for megamenu) ──────────────────

export function useBrands() {
  return useQuery<ApiBrand[]>({
    queryKey: ['brands'],
    queryFn: () => api.getBrands(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useBrand(slug: string) {
  return useQuery<ApiBrand | null>({
    queryKey: ['brand', slug],
    queryFn: () => api.getBrandBySlug(slug),
    enabled: !!slug,
  });
}

// ─── Categories ────────────────────────────────────

export function useCategories() {
  return useQuery<ApiCategory[]>({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// ─── Products ──────────────────────────────────────

export function useProducts(params?: {
  category?: string;
  brand?: string;
  model?: string;
  badge?: string;
  is_featured?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  gender?: string;
}) {
  return useQuery<{ data: ApiProduct[]; meta: any }>({
    queryKey: ['products', params],
    queryFn: () => api.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 min
    placeholderData: keepPreviousData,
  });
}

export function useProduct(slug: string) {
  return useQuery<ApiProduct | null>({
    queryKey: ['product', slug],
    queryFn: () => api.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function useRelatedProducts(slug: string, limit = 8) {
  return useQuery<ApiProduct[]>({
    queryKey: ['related-products', slug],
    queryFn: () => api.getRelatedProducts(slug, limit),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFeaturedProducts() {
  return useProducts({ is_featured: true, pageSize: 8 });
}

export function useNewProducts() {
  return useProducts({ badge: 'new', sort: 'new', pageSize: 8 });
}

// ─── Banners ───────────────────────────────────────

export function useBanners(position: 'hero' | 'promo') {
  return useQuery<ApiBanner[]>({
    queryKey: ['banners', position],
    queryFn: () => api.getBanners(position),
    staleTime: 30 * 60 * 1000, // 30 min
  });
}

// ─── Filters ───────────────────────────────────────

export function useCatalogFilters(params?: {
  category?: string;
  brand?: string;
}) {
  return useQuery<ApiFilters>({
    queryKey: ['catalog-filters', params],
    queryFn: () => api.getFilters(params),
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Site Config ───────────────────────────────────

export function useSiteConfig() {
  return useQuery<ApiSiteConfig>({
    queryKey: ['site-config'],
    queryFn: () => api.getSiteConfig(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ─── Search ────────────────────────────────────────

export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: () => api.search(query, page),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
