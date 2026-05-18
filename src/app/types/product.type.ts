export type ProductImageType = {
  id: number;
  url: string;
  position: number;
  createdAt?: Date;
};

export type ProductType = {
  id: number;
  name: string;
  description?: string;
  slug: string;
  price: number;
  images: ProductImageType[];
  stock: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};