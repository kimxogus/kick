import { jsonError } from "@/server/api-response";
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
    return Response.json(await kickService.getProductDetail(slug, viewerId));
  } catch (error) {
    return jsonError(error);
  }
}
