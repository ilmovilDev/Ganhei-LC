export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface HandleApiErrorParams {
  status: number;
  error: string;
}

export function handleApiError({ status, error }: HandleApiErrorParams): never {
  throw new ApiError(error, status);
}
