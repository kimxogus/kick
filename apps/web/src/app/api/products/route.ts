import { jsonError, readJson } from "@/server/api-response";
import type { ProductRegistrationInput } from "@/server/kick-service";
import { registerProduct } from "@/server/registered-store";

// product-kick Skill이 문서에서 추출한 제품을 파일 백업 store에 등록한다.
// 서버 재시작 시 instrumentation에서 store를 비우므로 영속되지 않는다.
export async function POST(request: Request): Promise<Response> {
  try {
    const input = await readJson<ProductRegistrationInput>(request);
    return Response.json(registerProduct(input));
  } catch (error) {
    return jsonError(error);
  }
}
