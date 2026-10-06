import { proxyAiBackend } from "@/service/ai-backend/client";
import { AI_BACKEND_ENDPOINTS } from "@/service/ai-backend/endpoints";

function getUploadedImage(formData: FormData): File | null {
  const value = formData.get("image");
  return value instanceof File ? value : null;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json(
      {
        code: "INVALID_IDENTIFICATION_FORM",
        message: "Identification yêu cầu multipart/form-data.",
      },
      { status: 400 }
    );
  }

  const image = getUploadedImage(formData);

  if (!image || image.size === 0) {
    return Response.json(
      {
        code: "INVALID_IDENTIFICATION_IMAGE",
        message: "Identification yêu cầu một file ảnh trong field image.",
      },
      { status: 400 }
    );
  }

  const backendFormData = new FormData();
  backendFormData.append(
    "image",
    image,
    image.name || "face-verify.jpg"
  );

  return proxyAiBackend({
    method: "POST",
    path: AI_BACKEND_ENDPOINTS.identification,
    body: backendFormData,
  });
}
