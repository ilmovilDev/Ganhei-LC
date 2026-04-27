export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(params: {
    message: string;
    code: string;
    statusCode?: number;
    context?: Record<string, unknown>;
  }) {
    super(params.message);

    this.name = "AppError";
    this.code = params.code;
    this.statusCode = params.statusCode ?? 400;
    this.context = params.context;
  }
}
