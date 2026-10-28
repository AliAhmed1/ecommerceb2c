"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createOrder, getCartItems, getOrderById, getOrdersByUser } from "@/db/query";
import { getCurrentUser } from "@/utilities/auth";
import type { Address } from "@/reducers/order/order.type";

export const checkoutAction = async (address: Address) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const cartItems = await getCartItems(user.id);
  if (cartItems.length === 0) return "Your cart is empty";

  const orderId = await createOrder(user.id, cartItems, address);
  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect(`/orders/${orderId}`);
};

export const getOrdersAction = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  return getOrdersByUser(user.id);
};

export const getOrderByIdAction = async (orderId: string) => {
  return getOrderById(orderId);
};
