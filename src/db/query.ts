import { createClient } from "@/utilities/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, Product } from "@/reducers/product/product.type";
import type { CartItem } from "@/reducers/cart/cart.type";
import type { Address, Order } from "@/reducers/order/order.type";

type ProductRow = {
  id: string;
  title: string;
  description: string;
  price: number | string;
  image_url: string | null;
  category_id: string | null;
  stock: number;
  sku: string | null;
  categories: { name: string } | { name: string }[] | null;
};

const toProduct = (row: ProductRow): Product => {
  const category = Array.isArray(row.categories)
    ? row.categories[0]
    : row.categories;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    categoryId: row.category_id,
    categoryName: category?.name ?? null,
    stock: row.stock,
    sku: row.sku,
  };
};

export const getAllProducts = async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => toProduct(row as ProductRow));
};

export const getProductById = async (
  productId: string
): Promise<Product | undefined> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", productId)
    .maybeSingle();
  if (error || !data) return;
  return toProduct(data as ProductRow);
};

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");
  if (error || !data) return [];
  return data;
};

const getOrCreateCartId = async (
  supabase: SupabaseClient,
  userId: string
): Promise<string> => {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();
  if (error || !created) throw new Error("Unable to create cart");
  return created.id as string;
};

type CartItemRow = {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    title: string;
    price: number | string;
    image_url: string | null;
    stock: number;
  } | null;
};

const toCartItem = (row: CartItemRow): CartItem => ({
  id: row.id,
  productId: row.product_id,
  title: row.products?.title ?? "",
  price: Number(row.products?.price ?? 0),
  imageUrl: row.products?.image_url ?? null,
  stock: row.products?.stock ?? 0,
  quantity: row.quantity,
});

export const getCartItems = async (userId: string): Promise<CartItem[]> => {
  const supabase = await createClient();
  const cartId = await getOrCreateCartId(supabase, userId);
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, quantity, product_id, products(title, price, image_url, stock)")
    .eq("cart_id", cartId)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => toCartItem(row as unknown as CartItemRow));
};

export const getCartItemCount = async (userId: string): Promise<number> => {
  const supabase = await createClient();
  const cartId = await getOrCreateCartId(supabase, userId);
  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cartId);
  if (error || !data) return 0;
  return data.reduce((sum, item) => sum + item.quantity, 0);
};

export const addCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const supabase = await createClient();
  const cartId = await getOrCreateCartId(supabase, userId);

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    return;
  }

  await supabase
    .from("cart_items")
    .insert({ cart_id: cartId, product_id: productId, quantity });
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  const supabase = await createClient();
  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    return;
  }
  await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
};

export const removeCartItem = async (cartItemId: string) => {
  const supabase = await createClient();
  await supabase.from("cart_items").delete().eq("id", cartItemId);
};

export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  address: Address
): Promise<string> => {
  const supabase = await createClient();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      shipping_address: address,
    })
    .select("id")
    .single();
  if (error || !order) throw new Error("Unable to create order");

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
  }));
  await supabase.from("order_items").insert(orderItems);

  const cartId = await getOrCreateCartId(supabase, userId);
  await supabase.from("cart_items").delete().eq("cart_id", cartId);

  return order.id as string;
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, status, total, shipping_address, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((order) => ({
    id: order.id,
    status: order.status,
    total: Number(order.total),
    shippingAddress: order.shipping_address as Address,
    createdAt: order.created_at,
    items: [],
  }));
};

export const getOrderById = async (
  orderId: string
): Promise<Order | undefined> => {
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, total, shipping_address, created_at")
    .eq("id", orderId)
    .maybeSingle();
  if (error || !order) return;

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_id, title, price, quantity")
    .eq("order_id", orderId);

  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    shippingAddress: order.shipping_address as Address,
    createdAt: order.created_at,
    items: (items ?? []).map((item) => ({
      id: item.id,
      productId: item.product_id,
      title: item.title,
      price: Number(item.price),
      quantity: item.quantity,
    })),
  };
};
