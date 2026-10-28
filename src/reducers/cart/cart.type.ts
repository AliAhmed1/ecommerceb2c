export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  total: number;
};
