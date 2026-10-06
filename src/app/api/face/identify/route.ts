import { proxyAiBackend } from "@/service/ai-backend/client";
import type { FaceIdentifyRequest } from "@/service/face-auth/types";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | FaceIdentifyRequest
    | null;

  if (!payload || typeof payload.image !== "string" || !payload.image) {
    return Response.json(
      {
        code: "INVALID_IDENTIFY_PAYLOAD",
        message: "Identify yêu cầu một ảnh Base64 trong trường image.",
      },
      { status: 400 }
    );
  }

  return proxyAiBackend({
    method: "POST",
    path: process.env.AI_IDENTIFY_PATH ?? "/identify",
    body: payload,
  });
}
