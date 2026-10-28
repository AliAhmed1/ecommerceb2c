import { getProductByIdAction } from "@/app/actions/Product";
import MainHeader from "@/app/components/header";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartForm } from "./components/addToCartForm";

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProductByIdAction(productId);
  if (!product) notFound();

  return (
    <>
      <MainHeader />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-5xl lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={product.imageUrl ?? "/placeholder-image.png"}
                alt={product.title}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div>
              {product.categoryName && (
                <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                  {product.categoryName}
                </p>
              )}
              <h1 className="mt-1 text-3xl font-semibold text-gray-900">
                {product.title}
              </h1>
              <p className="mt-4 text-2xl text-gray-900">
                {`$${product.price.toFixed(2)}`}
              </p>
              <p className="mt-4 text-base text-gray-600">
                {product.description}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
              <AddToCartForm
                productId={product.id}
                inStock={product.stock > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
