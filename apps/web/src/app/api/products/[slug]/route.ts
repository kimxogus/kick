import { jsonError } from "@/server/api-response";
import { findRegisteredDetail } from "@/server/registered-store";
import { kickService } from "@/server/service-singleton";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext): Promise<Response> {
  try {
    const { slug } = await context.params;
    const url = new URL(request.url);
    const viewerId = url.searchParams.get("viewer_id") ?? undefined;
    try {
      return Response.json(await kickService.getProductDetail(slug, viewerId));
    } catch (error) {
      // seed에 없으면 Skill이 등록한 제품(store)을 확인한다.
      if ((error as { code?: string })?.code === "NOT_FOUND") {
        const registered = findRegisteredDetail(slug);
        if (registered) {
          return Response.json(registered);
        }
      }
      throw error;
    }
  } catch (error) {
    return jsonError(error);
  }
}
