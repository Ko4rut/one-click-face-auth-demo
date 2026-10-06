import { requestJson } from "@/service/http/api-client";
import { FACE_AUTH_ENDPOINTS } from "./endpoints";
import type { FaceHealthResponse } from "./types";

export function getFaceApiHealth(): Promise<FaceHealthResponse> {
  return requestJson<FaceHealthResponse>(FACE_AUTH_ENDPOINTS.health, {
    method: "GET",
  });
}
