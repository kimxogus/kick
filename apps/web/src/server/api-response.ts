import { KickServiceError } from "./kick-service";

export function jsonError(error: unknown): Response {
  if (error instanceof KickServiceError) {
    return Response.json(
      {
        error: {
          code: error.code,
          message: error.message,
          fields: error.fields
        }
      },
      { status: error.code === "NOT_FOUND" ? 404 : 400 }
    );
  }

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "요청을 처리하지 못했습니다.",
        fields: []
      }
    },
    { status: 500 }
  );
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    const body = (await request.json()) as unknown;
    if (!isRecord(body)) {
      throw new KickServiceError("VALIDATION_ERROR", "JSON 요청 본문을 확인해주세요.", ["body"]);
    }
    return body as T;
  } catch {
    throw new KickServiceError("VALIDATION_ERROR", "JSON 요청 본문을 확인해주세요.", ["body"]);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
