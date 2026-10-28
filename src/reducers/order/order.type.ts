export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  id: string;
  productId: string | null;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  shippingAddress: Address;
  createdAt: string;
  items: OrderItem[];
};
