import { jsonError } from "@/server/api-response";
import { kickService } from "@/server/service-singleton";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  try {
    const { id } = await context.params;
    return Response.json(await kickService.getMakerSubmission(id));
  } catch (error) {
    return jsonError(error);
  }
}
