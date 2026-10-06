import { request } from "@/service/http/api-client";
import { FACE_AUTH_ENDPOINTS } from "../endpoints";
import type {
  EnrollmentRequest,
  EnrollmentResponse,
} from "./enrollment.types";

function buildEnrollmentFormData(
  payload: EnrollmentRequest
): FormData {
  const formData = new FormData();

  formData.append("user_id", payload.userId.trim());

  payload.images.forEach((image, index) => {
    formData.append(
      "images",
      image,
      `face-${index + 1}.jpg`
    );
  });

  return formData;
}

export function enrollFace(
  payload: EnrollmentRequest
): Promise<EnrollmentResponse> {
  return request<EnrollmentResponse>(
    FACE_AUTH_ENDPOINTS.enroll,
    {
      method: "POST",
      body: buildEnrollmentFormData(payload),
    }
  );
}
