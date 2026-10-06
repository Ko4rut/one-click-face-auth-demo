import { proxyAiBackend } from "@/service/ai-backend/client";
import type { FaceEnrollRequest } from "@/service/face-auth/types";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | FaceEnrollRequest
    | null;

  if (
    !payload ||
    typeof payload.user_id !== "string" ||
    !payload.user_id.trim() ||
    !Array.isArray(payload.frames) ||
    payload.frames.length === 0 ||
    payload.frames.some((frame) => typeof frame !== "string" || !frame)
  ) {
    return Response.json(
      {
        code: "INVALID_ENROLL_PAYLOAD",
        message: "Enrollment yêu cầu user_id và ít nhất một frame Base64.",
      },
      { status: 400 }
    );
  }

  return proxyAiBackend({
    method: "POST",
    path: process.env.AI_ENROLL_PATH ?? "/enroll",
    body: {
      ...payload,
      user_id: payload.user_id.trim(),
    },
  });
}
