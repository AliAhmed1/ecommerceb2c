"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCartAction } from "@/app/actions/Cart";

export const AddToCartForm: React.FC<{
  productId: string;
  inStock: boolean;
}> = ({ productId, inStock }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      await addToCartAction(productId, quantity);
      setMessage("Added to cart!");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleAddToCart} className="mt-6 flex items-center gap-4">
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-20 rounded border px-3 py-2"
        disabled={!inStock}
      />
      <button
        type="submit"
        disabled={!inStock || isPending}
        className="px-6 py-2 bg-indigo-600 text-white rounded cursor-pointer disabled:opacity-60"
      >
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
      {message && <span className="text-sm text-green-600">{message}</span>}
    </form>
  );
};
