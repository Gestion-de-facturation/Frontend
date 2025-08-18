"use client";

import UpdateProductForm from "@/components/products/UpdateProductForm";
import { useParams } from "next/navigation";

export default function UpdateProductPage() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  return (
    <div>
      <UpdateProductForm productId={productId} />
    </div>
  );
}
