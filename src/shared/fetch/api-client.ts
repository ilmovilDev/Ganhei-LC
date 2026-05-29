import { parseResponse } from "./parse-response";

interface ApiClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiClient<T>(
  input: RequestInfo | URL,
  options?: ApiClientOptions,
): Promise<T> {
  const response = await fetch(input, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...options?.headers,
    },

    body:
      options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  return parseResponse<T>(response);
}
