export interface ApiSuccessResponse<T = void> {
  success: true;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

export type ApiResponse<T = void> = ApiSuccessResponse<T> | ApiErrorResponse;
