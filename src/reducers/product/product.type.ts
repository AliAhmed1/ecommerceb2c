export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  stock: number;
  sku: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

