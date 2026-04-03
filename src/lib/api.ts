/**
 * Strapi API client for KICKSTEP store
 */

const API_URL = import.meta.env.VITE_API_URL || '';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiImage {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

// ─── Types matching Strapi responses ───────────────

export interface ApiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  attribute_schema: any;
  is_active: boolean;
  sort_order: number;
  icon?: StrapiImage;
  hero_image?: StrapiImage;
}

export interface ApiBrand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  logo?: StrapiImage;
  hero_image?: StrapiImage;
  hero_image_mob?: StrapiImage;
  description?: string;
  is_active: boolean;
  sort_order: number;
  seo_title?: string;
  seo_desc?: string;
  models?: ApiModel[];
}

export interface ApiModel {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  image?: StrapiImage;
  is_active: boolean;
  sort_order: number;
  brand?: ApiBrand;
}

export interface ApiProductSize {
  id: number;
  size_eu: number;
  in_stock: boolean;
}

export interface ApiProduct {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number;
  images?: StrapiImage[];
  description?: string;
  sizes?: ApiProductSize[];
  color_name?: string;
  color_hex?: string;
  color_siblings?: ApiProduct[];
  badge: 'none' | 'new' | 'hit' | 'last_size';
  is_active: boolean;
  is_featured: boolean;
  tags?: string[];
  seo_title?: string;
  seo_desc?: string;
  sort_order: number;
  views_count: number;
  gender?: 'men' | 'women' | 'unisex';
  brand?: ApiBrand;
  model?: ApiModel;
}

export interface ApiBanner {
  id: number;
  documentId: string;
  title: string;
  position: 'hero' | 'promo';
  image_desktop?: StrapiImage;
  image_mobile?: StrapiImage;
  heading?: string;
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  cta_text_2?: string;
  cta_link_2?: string;
  is_active: boolean;
  sort_order: number;
}

export interface ApiSiteConfig {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  address?: string;
  working_hours?: string;
  delivery_moscow_free?: string;
  delivery_moscow_paid?: string;
  delivery_russia?: string;
  returns_policy?: string;
  about_text?: string;
  privacy_policy?: string;
  offer_agreement?: string;
}

export interface ApiSearchResult {
  products: ApiProduct[];
  brands: ApiBrand[];
  total: number;
  page: number;
  pageCount: number;
}

export interface ApiFilters {
  brands: { id: number; name: string; slug: string }[];
  categories: { id: number; name: string; slug: string }[];
  priceRange: { min: number; max: number };
  sizes: string[];
  colors: string[];
  total: number;
}

// ─── Helper to build full image URL ────────────────

export function getImageUrl(image?: StrapiImage | null): string {
  if (!image) return '';
  if (image.url.startsWith('http')) return image.url;
  return `${API_URL}${image.url}`;
}

export function getImageUrlSmall(image?: StrapiImage | null): string {
  if (!image) return '';
  const small = image.formats?.small?.url || image.formats?.medium?.url || image.url;
  if (small.startsWith('http')) return small;
  return `${API_URL}${small}`;
}

export function getImageUrls(images?: StrapiImage[] | null): string[] {
  if (!images) return [];
  return images.map((img) => getImageUrl(img));
}

export function getImageUrlsSmall(images?: StrapiImage[] | null): string[] {
  if (!images) return [];
  return images.map((img) => getImageUrlSmall(img));
}

// ─── API fetch wrapper ─────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Превышено время ожидания сервера');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── API methods ───────────────────────────────────

export const api = {
  // Categories
  async getCategories(): Promise<ApiCategory[]> {
    const res = await apiFetch<StrapiResponse<ApiCategory[]>>(
      '/categories?filters[is_active][$eq]=true&sort=sort_order:asc&populate=*'
    );
    return res.data;
  },

  // Brands
  async getBrands(): Promise<ApiBrand[]> {
    const res = await apiFetch<StrapiResponse<ApiBrand[]>>(
      '/brands?filters[is_active][$eq]=true&sort=sort_order:asc&populate=*'
    );
    return res.data;
  },

  async getBrandBySlug(slug: string): Promise<ApiBrand | null> {
    const res = await apiFetch<StrapiResponse<ApiBrand[]>>(
      `/brands?filters[slug][$eq]=${slug}&filters[is_active][$eq]=true&populate=*`
    );
    return res.data[0] || null;
  },

  // Products
  async getProducts(params?: {
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
  }): Promise<{ data: ApiProduct[]; meta: any }> {
    const qs = new URLSearchParams();
    qs.set('filters[is_active][$eq]', 'true');
    qs.set('populate', '*');

    if (params?.category)
      qs.set('filters[category][slug][$eq]', params.category);
    if (params?.brand) qs.set('filters[brand][slug][$eq]', params.brand);
    if (params?.model) qs.set('filters[model][slug][$eq]', params.model);
    if (params?.badge) qs.set('filters[badge][$eq]', params.badge);
    if (params?.is_featured)
      qs.set('filters[is_featured][$eq]', 'true');
    if (params?.search) {
      if (params.search.includes('|')) {
        const terms = params.search.split('|').map(t => t.trim());
        terms.forEach((term, i) => {
          qs.set(`filters[$or][${i}][name][$containsi]`, term);
        });
      } else {
        qs.set('filters[name][$containsi]', params.search);
      }
    }
    if (params?.gender) {
      qs.set('filters[$or][0][gender][$eq]', params.gender);
      qs.set('filters[$or][1][gender][$eq]', 'unisex');
    }

    // Sort — always add id:asc as tiebreaker for stable ordering
    const sortMap: Record<string, string[]> = {
      popular: ['views_count:desc', 'id:asc'],
      price_asc: ['price:asc', 'id:asc'],
      price_desc: ['price:desc', 'id:asc'],
      new: ['createdAt:desc', 'id:asc'],
      name: ['name:asc', 'id:asc'],
    };
    const sortFields = sortMap[params?.sort || 'popular'] || ['sort_order:asc', 'id:asc'];
    sortFields.forEach((s, i) => qs.set(`sort[${i}]`, s));

    // Pagination
    qs.set('pagination[page]', String(params?.page || 1));
    qs.set('pagination[pageSize]', String(params?.pageSize || 24));

    return apiFetch<{ data: ApiProduct[]; meta: any }>(`/products?${qs}`);
  },

  async getProductBySlug(slug: string): Promise<ApiProduct | null> {
    const res = await apiFetch<StrapiResponse<ApiProduct[]>>(
      `/products?filters[slug][$eq]=${slug}&filters[is_active][$eq]=true&populate=*`
    );
    return res.data[0] || null;
  },

  async getRelatedProducts(slug: string, limit = 8): Promise<ApiProduct[]> {
    const res = await apiFetch<{ data: ApiProduct[] }>(
      `/products/${slug}/related?limit=${limit}`
    );
    return res.data;
  },

  async incrementView(slug: string): Promise<void> {
    await apiFetch(`/products/${slug}/view`, { method: 'POST' });
  },

  // Banners
  async getBanners(position: 'hero' | 'promo'): Promise<ApiBanner[]> {
    const res = await apiFetch<StrapiResponse<ApiBanner[]>>(
      `/banners?filters[position][$eq]=${position}&filters[is_active][$eq]=true&sort=sort_order:asc&populate=*`
    );
    return res.data;
  },

  // Search
  async search(
    query: string,
    page = 1,
    limit = 24
  ): Promise<ApiSearchResult> {
    const res = await apiFetch<{ data: ApiSearchResult }>(
      `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    return res.data;
  },

  // Filters
  async getFilters(params?: {
    category?: string;
    brand?: string;
  }): Promise<ApiFilters> {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.brand) qs.set('brand', params.brand);
    const res = await apiFetch<{ data: ApiFilters }>(
      `/catalog/filters?${qs}`
    );
    return res.data;
  },

  // Site Config
  async getSiteConfig(): Promise<ApiSiteConfig> {
    const res = await apiFetch<StrapiResponse<ApiSiteConfig>>(
      '/site-config'
    );
    return res.data;
  },

  // Orders
  async submitOrder(data: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_type: string;
    delivery_address?: string;
    delivery_date?: string;
    comment?: string;
    items: any[];
    total_old_price?: number;
    total_with_discount?: number;
    cash_discount?: number;
    payment_type?: string;
    _hp?: string; // honeypot
  }): Promise<{ success: boolean; order_number: number }> {
    return apiFetch('/orders/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Callback request (footer form)
  async submitCallback(phone: string): Promise<{ success: boolean }> {
    return apiFetch('/callbacks/submit', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Health
  async health(): Promise<any> {
    return apiFetch('/health');
  },
};
