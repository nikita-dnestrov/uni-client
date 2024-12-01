export type TProduct = {
  id: string;
  name: string;
  brand: string;
  description: string;
  isArchived: boolean;
  material?: string | null;
  gender: string;
  category: string;
  colors: ProductColor[];
};

type ProductColor = {
  id: string;
  color: string;
  productId: string;
  images: ProductImage[];
  sizes: ProductSize[];
};

type ProductSize = {
  id: string;
  size: number;
  stock: number;
  price: number;
  colorId: string;
  color: ProductColor;
};

type ProductImage = {
  id: string;
  url: string;
  colorId: string;
  color: ProductColor;
};
