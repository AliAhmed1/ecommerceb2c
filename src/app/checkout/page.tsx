import MainHeader from "@/app/components/header";
import { getCartAction } from "@/app/actions/Cart";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./components/checkoutForm";

export default async function CheckoutPage() {
  const items = await getCartAction();
  if (items.length === 0) redirect("/cart");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <MainHeader />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Checkout
          </h1>
          <div className="mb-8 rounded border p-4">
            <p className="text-sm text-gray-600">
              {items.length} item(s) in cart
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {`Total: $${total.toFixed(2)}`}
            </p>
          </div>
          <CheckoutForm />
        </div>
      </div>
    </>
  );
}
