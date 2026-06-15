import { jsonError, readJson } from "@/server/api-response";
import type { MakerSubmissionRequest } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

export async function POST(request: Request): Promise<Response> {
  try {
    return Response.json(await kickService.createMakerSubmission(await readJson<MakerSubmissionRequest>(request)));
  } catch (error) {
    return jsonError(error);
  }
}
