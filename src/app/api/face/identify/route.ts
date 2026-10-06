import { proxyAiBackend } from "@/service/ai-backend/client";
import type { FaceIdentifyRequest } from "@/service/face-auth/types";

function decodeBase64Image(imageBase64: string): Blob {
  const normalized = imageBase64.includes(",")
    ? imageBase64.slice(imageBase64.indexOf(",") + 1)
    : imageBase64;

  const bytes = Uint8Array.from(
    Buffer.from(normalized, "base64")
  );

  return new Blob([bytes], { type: "image/jpeg" });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | FaceIdentifyRequest
    | null;

  if (!payload || typeof payload.image !== "string" || !payload.image.trim()) {
    return Response.json(
      {
        code: "INVALID_IDENTIFY_PAYLOAD",
        message: "Identify yêu cầu một ảnh Base64 trong trường image.",
      },
      { status: 400 }
    );
  }

  try {
    const image = decodeBase64Image(payload.image);

    if (image.size === 0) {
      throw new Error("Decoded image is empty.");
    }

    const formData = new FormData();
    formData.append("image", image, "face-verify.jpg");

    return proxyAiBackend({
      method: "POST",
      path: process.env.AI_IDENTIFY_PATH ?? "/api/v1/identification",
      body: formData,
    });
  } catch {
    return Response.json(
      {
        code: "INVALID_IDENTIFY_IMAGE",
        message: "Không thể giải mã ảnh Base64 để nhận diện.",
      },
      { status: 400 }
    );
  }
}
