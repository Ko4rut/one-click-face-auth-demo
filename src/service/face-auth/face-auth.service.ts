import { requestJson } from "@/service/http/api-client";
import { FACE_AUTH_ENDPOINTS } from "./endpoints";
import type {
  FaceHealthResponse,
  FaceIdentifyRequest,
  FaceIdentifyResponse,
} from "./types";

export function identifyFace(
  payload: FaceIdentifyRequest
): Promise<FaceIdentifyResponse> {
  return requestJson<FaceIdentifyResponse>(FACE_AUTH_ENDPOINTS.identify, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getFaceApiHealth(): Promise<FaceHealthResponse> {
  return requestJson<FaceHealthResponse>(FACE_AUTH_ENDPOINTS.health, {
    method: "GET",
  });
}
