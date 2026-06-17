import { ProductsView } from "@/components/products-view";
import { kickService } from "@/server/service-singleton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  return <ProductsView initialResponse={await kickService.getWeeklyBoard({})} />;
}
