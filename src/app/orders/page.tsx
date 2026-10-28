import MainHeader from "@/app/components/header";
import { getOrdersAction } from "@/app/actions/Order";
import Link from "next/link";

export default async function OrdersPage() {
  const orders = await getOrdersAction();

  return (
    <>
      <MainHeader />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <p className="text-gray-600">You have no orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-200 border-t border-b">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between py-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {`$${order.total.toFixed(2)}`}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
