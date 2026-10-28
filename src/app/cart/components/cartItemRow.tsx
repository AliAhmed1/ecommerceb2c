"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { CartItem } from "@/reducers/cart/cart.type";
import { removeCartItemAction, updateCartItemAction } from "@/app/actions/Cart";

export const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateQuantity = (quantity: number) => {
    if (quantity < 1) return;
    startTransition(async () => {
      await updateCartItemAction(item.id, quantity);
      router.refresh();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItemAction(item.id);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-4 py-6">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-200">
        <Image
          src={item.imageUrl ?? "/placeholder-image.png"}
          alt={item.title}
          width={80}
          height={80}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{`$${item.price.toFixed(2)}`}</p>
      </div>
      <input
        type="number"
        min={1}
        max={item.stock}
        value={item.quantity}
        disabled={isPending}
        onChange={(e) => handleUpdateQuantity(Number(e.target.value))}
        className="w-16 rounded border px-2 py-1"
      />
      <p className="w-20 text-right text-sm font-medium text-gray-900">
        {`$${(item.price * item.quantity).toFixed(2)}`}
      </p>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        className="text-sm text-red-600 hover:underline cursor-pointer disabled:opacity-60"
      >
        Remove
      </button>
    </div>
  );
};
