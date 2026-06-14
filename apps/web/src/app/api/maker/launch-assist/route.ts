import { jsonError, readJson } from "@/server/api-response";
import type { MakerSubmissionDraft } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

export async function POST(request: Request): Promise<Response> {
  try {
    return Response.json(kickService.createLaunchAssist(await readJson<MakerSubmissionDraft>(request)));
  } catch (error) {
    return jsonError(error);
  }
}
