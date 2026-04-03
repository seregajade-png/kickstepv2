export interface Product {
  id: number
  name: string
  slug: string
  brand: string
  model: string
  price: number
  oldPrice?: number
  images: string[]
  thumbImages: string[]
  colorName: string
  colorHex: string
  colorSiblings: ColorSibling[]
  sizes: Size[]
  badge?: 'new' | 'hit' | 'last_size'
  description?: string
  gender?: 'men' | 'women' | 'unisex'
}

export interface Size {
  eu: string
  us: string
  ru: string
  inStock: boolean
}

export interface ColorSibling {
  slug: string
  colorName: string
  colorHex: string
  image: string
}

export interface Brand {
  id: number
  name: string
  slug: string
  logo: string
}

export interface CartItem {
  id: number
  slug: string
  name: string
  brand: string
  image: string
  price: number
  oldPrice?: number
  color: string
  sizeRu: string
  sizeEu: string
  quantity: number
  addedAt: string
}

export interface WishlistItem {
  id: number
  slug: string
  name: string
  brand: string
  image: string
  price: number
  colorName: string
  colorHex: string
}
