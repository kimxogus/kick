import { jsonError } from "@/server/api-response";
import { kickService } from "@/server/service-singleton";

export function GET(request: Request): Response {
  try {
    const url = new URL(request.url);
    return Response.json(
      kickService.getWeeklyBoard({
        q: url.searchParams.get("q") ?? undefined,
        tag: url.searchParams.get("tag") ?? undefined,
        viewerId: url.searchParams.get("viewer_id") ?? undefined
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
