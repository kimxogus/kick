import { jsonError, readJson } from "@/server/api-response";
import type { NewsletterRequest } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

export async function POST(request: Request): Promise<Response> {
  try {
    return Response.json(kickService.createNewsletterSubscription(await readJson<NewsletterRequest>(request)));
  } catch (error) {
    return jsonError(error);
  }
}
