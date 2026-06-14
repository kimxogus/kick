import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail-view";
import { KickServiceError } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    return <ProductDetailView detail={kickService.getProductDetail(slug)} />;
  } catch (error) {
    if (error instanceof KickServiceError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
