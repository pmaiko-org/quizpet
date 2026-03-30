export class FsException extends Error {
  public readonly filename?: string;
  public override readonly cause?: unknown;

  constructor(
    message: string,
    options?: { filename?: string; cause?: unknown },
  ) {
    super(message);

    this.name = 'FsException';
    this.filename = options?.filename;
    this.cause = options?.cause;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
