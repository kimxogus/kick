import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail-view";
import { findRegisteredDetail } from "@/server/registered-store";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug: rawSlug } = await params;
  // RSC params는 non-ASCII slug가 URL-encoded로 들어올 수 있어 디코드한다.
  const slug = safeDecode(rawSlug);
  try {
    return <ProductDetailView detail={await kickService.getProductDetail(slug)} />;
  } catch (error) {
    // 번들 중복으로 instanceof가 깨질 수 있어 code 속성으로 판별한다.
    if ((error as { code?: string })?.code === "NOT_FOUND") {
      // seed에 없으면 Skill이 등록한 제품(파일 store)을 확인한다.
      const registered = findRegisteredDetail(slug);
      if (registered) {
        return <ProductDetailView detail={registered} />;
      }
      notFound();
    }
    throw error;
  }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
