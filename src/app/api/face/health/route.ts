import { proxyAiBackend } from "@/service/ai-backend/client";

export async function GET() {
  return proxyAiBackend({
    method: "GET",
    path: process.env.AI_HEALTH_PATH ?? "/health",
  });
}
