export type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  image: string;
  description?: string;
};