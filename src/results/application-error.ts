import { ApplicationErrorCodes } from './application-error-codes';

export class ApplicationError<T = Record<string | number, unknown>> extends Error {
  constructor(
    public readonly errorCode: ApplicationErrorCodes,
    public readonly description?: string,
    public readonly details?: T
  ) {
    super(errorCode);

    // Need to override the prototype
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  setStack(stack?: string) {
    this.stack = stack;
  }

  static fromError(error: Error) {
    const applicationError = new ApplicationError(ApplicationErrorCodes.INTERNAL_ERROR, error.message);

    applicationError.setStack(error.stack);

    return applicationError;
  }
}

export const isApplicationError = (error: unknown): error is ApplicationError =>
  error instanceof ApplicationError && error.errorCode.length > 0;