import { jsonError, readJson } from "@/server/api-response";
import type { ProductRegistrationInput } from "@/server/kick-service";
import { kickService } from "@/server/service-singleton";

// product-kick Skill이 문서에서 추출한 제품을 런타임 저장소에 등록한다.
export async function POST(request: Request): Promise<Response> {
  try {
    const input = await readJson<ProductRegistrationInput>(request);
    return Response.json(await kickService.registerProduct(input));
  } catch (error) {
    return jsonError(error);
  }
}
