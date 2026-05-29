import { ApiResponse } from "../types/api-response.type";
import { handleApiError } from "./handle-api-error";

export async function parseResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    handleApiError({
      status: response.status,
      error: json.success === false ? json.error : "Unknown error",
    });
  }

  return json.data;
}
