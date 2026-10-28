import MainHeader from "@/app/components/header";
import { getCartAction } from "@/app/actions/Cart";
import { CartItemRow } from "./components/cartItemRow";
import Link from "next/link";

export default async function CartPage() {
  const items = await getCartAction();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <MainHeader />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>

          {items.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="text-gray-600">Your cart is empty.</p>
              <Link
                href="/shop"
                className="mt-4 inline-block text-indigo-600 hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <span className="text-lg font-medium text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {`$${total.toFixed(2)}`}
                </span>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href="/checkout"
                  className="px-6 py-2 bg-indigo-600 text-white rounded cursor-pointer"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
