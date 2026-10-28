"use server";
import { getAllProducts, getCategories, getProductById } from "@/db/query";

export const getAllProductsAction = async () => getAllProducts();

export const getCategoriesAction = async () => getCategories();

export const getProductByIdAction = async (productId: string) => {
  const product = await getProductById(productId);
  if (!product) return;
  return product;
};

