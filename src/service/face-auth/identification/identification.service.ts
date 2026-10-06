import { request } from "@/service/http/api-client";
import { FACE_AUTH_ENDPOINTS } from "../endpoints";
import type {
  IdentificationRequest,
  IdentificationResponse,
} from "./identification.types";

function buildIdentificationFormData(
  payload: IdentificationRequest
): FormData {
  const formData = new FormData();

  formData.append(
    "image",
    payload.image,
    "face-verify.jpg"
  );

  return formData;
}

export function identifyFace(
  payload: IdentificationRequest
): Promise<IdentificationResponse> {
  return request<IdentificationResponse>(
    FACE_AUTH_ENDPOINTS.identify,
    {
      method: "POST",
      body: buildIdentificationFormData(payload),
    }
  );
}
