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
};

export async function requestJson<TResponse>(
  input: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | TResponse
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const error = payload as ApiErrorPayload | null;

    throw new ApiRequestError(
      error?.message ?? "Yêu cầu API thất bại.",
      response.status,
      error?.code
    );
  }

  return payload as TResponse;
}
