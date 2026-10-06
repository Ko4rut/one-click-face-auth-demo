export class ApiRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

type FastApiValidationError = {
  type?: string;
  loc?: Array<string | number>;
  msg?: string;
  input?: unknown;
};

type ApiErrorPayload = {
  code?: string;
  message?: string;
  detail?: string | FastApiValidationError[] | Record<string, unknown>;
};

function getApiErrorMessage(error: ApiErrorPayload | null): string {
  if (!error) {
    return "Yêu cầu API thất bại.";
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  if (typeof error.detail === "string" && error.detail.trim()) {
    return error.detail;
  }

  if (Array.isArray(error.detail)) {
    const messages = error.detail
      .map((item) => item?.msg)
      .filter((message): message is string => Boolean(message));

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  if (error.detail && typeof error.detail === "object") {
    try {
      return JSON.stringify(error.detail);
    } catch {
      return "Yêu cầu API thất bại.";
    }
  }

  return "Yêu cầu API thất bại.";
}

async function parseResponse<TResponse>(
  response: Response
): Promise<TResponse> {
  const payload = (await response.json().catch(() => null)) as
    | TResponse
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const error = payload as ApiErrorPayload | null;

    throw new ApiRequestError(
      getApiErrorMessage(error),
      response.status,
      error?.code
    );
  }

  return payload as TResponse;
}

export async function request<TResponse>(
  input: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(input, init);
  return parseResponse<TResponse>(response);
}

export function requestJson<TResponse>(
  input: string,
  init?: RequestInit
): Promise<TResponse> {
  return request<TResponse>(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}
