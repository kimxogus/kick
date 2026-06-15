import { jsonError, readJson } from "@/server/api-response";
import type { VoteRequest } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

export async function POST(request: Request): Promise<Response> {
  try {
    return Response.json(await kickService.toggleVote(await readJson<VoteRequest>(request)));
  } catch (error) {
    return jsonError(error);
  }
}
