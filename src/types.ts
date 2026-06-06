export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number; // in TZS
  rating: number; // 0-5
  description: string;
  ingredients: string;
  usage: string;
  images: string[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export type ActiveTab = 'explore' | 'categories' | 'cart' | 'wishlist' | 'profile';
