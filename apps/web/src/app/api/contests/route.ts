import { jsonError } from "@/server/api-response";
import { kickService } from "@/server/service-singleton";

export function GET(_request: Request): Response {
  try {
    return Response.json(kickService.getContests());
  } catch (error) {
    return jsonError(error);
  }
}
