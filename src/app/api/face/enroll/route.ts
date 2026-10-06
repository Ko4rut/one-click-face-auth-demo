import { proxyAiBackend } from "@/service/ai-backend/client";
import { AI_BACKEND_ENDPOINTS } from "@/service/ai-backend/endpoints";

function getUploadedImages(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File);
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return Response.json(
      {
        code: "INVALID_ENROLLMENT_FORM",
        message: "Enrollment yêu cầu multipart/form-data.",
      },
      { status: 400 }
    );
  }

  const rawUserId = formData.get("user_id");
  const userId =
    typeof rawUserId === "string" ? rawUserId.trim() : "";
  const images = getUploadedImages(formData);

  if (!userId) {
    return Response.json(
      {
        code: "INVALID_ENROLLMENT_USER_ID",
        message: "user_id không được để trống.",
      },
      { status: 400 }
    );
  }

  if (images.length === 0) {
    return Response.json(
      {
        code: "INVALID_ENROLLMENT_IMAGES",
        message: "Enrollment yêu cầu ít nhất một ảnh.",
      },
      { status: 400 }
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("user_id", userId);

  images.forEach((image) => {
    backendFormData.append(
      "images",
      image,
      image.name || "face.jpg"
    );
  });

  return proxyAiBackend({
    method: "POST",
    path: AI_BACKEND_ENDPOINTS.enrollment,
    body: backendFormData,
  });
}
