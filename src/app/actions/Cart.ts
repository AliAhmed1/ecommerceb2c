"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addCartItem,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "@/db/query";
import { getCurrentUser } from "@/utilities/auth";

export const getCartAction = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  return getCartItems(user.id);
};

export const addToCartAction = async (productId: string, quantity: number) => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await addCartItem(user.id, productId, quantity);
  revalidatePath("/cart");
};

export const updateCartItemAction = async (
  cartItemId: string,
  quantity: number
) => {
  await updateCartItemQuantity(cartItemId, quantity);
  revalidatePath("/cart");
};

export const removeCartItemAction = async (cartItemId: string) => {
  await removeCartItem(cartItemId);
  revalidatePath("/cart");
};
