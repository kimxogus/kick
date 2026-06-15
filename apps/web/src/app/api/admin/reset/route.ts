import { jsonError } from "@/server/api-response";
import { kickService } from "@/server/service-singleton";

export async function POST(_request: Request): Promise<Response> {
  try {
    return Response.json(await kickService.resetToSeed());
  } catch (error) {
    return jsonError(error);
  }
}
