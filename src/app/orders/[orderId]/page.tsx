import MainHeader from "@/app/components/header";
import { getOrderByIdAction } from "@/app/actions/Order";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await getOrderByIdAction(orderId);
  if (!order) notFound();

  return (
    <>
      <MainHeader />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} ·{" "}
            Status: {order.status}
          </p>

          <div className="mt-8 divide-y divide-gray-200 border-t border-b">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty {item.quantity} × {`$${item.price.toFixed(2)}`}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {`$${(item.price * item.quantity).toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              {`$${order.total.toFixed(2)}`}
            </span>
          </div>

          <div className="mt-8 rounded border p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Shipping Address
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2
                ? `, ${order.shippingAddress.line2}`
                : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
