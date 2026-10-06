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

type ApiErrorPayload = {
  code?: string;
  message?: string;
  detail?: string;
};

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
      error?.message ??
        error?.detail ??
        "Yêu cầu API thất bại.",
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
