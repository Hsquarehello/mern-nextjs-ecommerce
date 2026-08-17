import { ProductForm } from "@/components/dashboard/product-form";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <ProductForm initialData={product} />
    </div>
  );
}
