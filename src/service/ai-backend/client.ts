type ProxyMethod = "GET" | "POST" | "DELETE";

type AiBackendProxyOptions = {
  method: ProxyMethod;
  path: string;
  body?: BodyInit;
  headers?: HeadersInit;
};

function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizePath(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

export async function proxyAiBackend({
  method,
  path,
  body,
  headers,
}: AiBackendProxyOptions): Promise<Response> {
  const baseUrl = process.env.AI_API_BASE_URL?.trim();

  if (!baseUrl) {
    return Response.json(
      {
        code: "AI_API_NOT_CONFIGURED",
        message:
          "AI_API_BASE_URL chưa được cấu hình. Hãy tạo .env.local từ .env.example.",
      },
      { status: 503 }
    );
  }

  const url = `${normalizeBaseUrl(baseUrl)}${normalizePath(path)}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseText = await response.text();
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return new Response(responseText || "{}", {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      return Response.json(
        {
          code: "AI_BACKEND_ERROR",
          message:
            responseText || `AI Backend trả về HTTP ${response.status}.`,
        },
        { status: response.status }
      );
    }

    return Response.json(
      {
        code: "AI_BACKEND_INVALID_RESPONSE",
        message: "AI Backend không trả về JSON như contract dự kiến.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("AI backend request failed:", error);

    return Response.json(
      {
        code: "AI_BACKEND_UNREACHABLE",
        message:
          "Không thể kết nối AI Backend. Hãy kiểm tra service Python và AI_API_BASE_URL.",
      },
      { status: 502 }
    );
  }
}
