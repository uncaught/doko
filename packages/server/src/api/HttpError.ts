export default class HttpError extends Error {
  public readonly code: string;
  public readonly context: object | null;
  public readonly status: number;

  constructor(status: number, code: string, context: object | null = null) {
    super(JSON.stringify({status, code, context}));
    this.code = code;
    this.context = context;
    this.status = status;
  }
}
