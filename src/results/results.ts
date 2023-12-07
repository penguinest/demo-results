import { ApplicationError } from './application-error';

//#region Types

export type Ok<T> = {
  value: T;
};

export type Result<T> = Ok<T> | ApplicationError;
export type PromiseResult<T> = Promise<Result<T>>;

//#endregion


export const ok = <T>(data: T): Ok<T> => ({
  value: data
});

const fromAsyncTryCatch = <O extends Error = Error, E extends ApplicationError = ApplicationError>(
  errorFn: (originalError: O) => E) =>
    async <DataType>(fn: () => DataType | Promise<DataType>): PromiseResult<DataType> => {
      try {
        const res = await fn();

        return ok<DataType>(res);
      } catch (catchErr) {
        return errorFn(catchErr);
      }
  };


export const effectiveResult = fromAsyncTryCatch<Error | ApplicationError, ApplicationError>(
  (error) => {
    if (error instanceof ApplicationError) {
      return error;
    }

    return ApplicationError.fromError(error || new Error());
  }
);

//#region Assertions

export const isErrorResult = <T = unknown>(result: Result<T>): result is ApplicationError =>
  result && 'errorCode' in result;

export const isOkResult = <T = unknown>(result: Result<T>): result is Ok<T> =>
  result && 'value' in result;

export const filterOkResults = <T = unknown>(results: Array<Result<T>>) =>
  results.filter((result): result is Ok<T> => isOkResult(result));

export const filterErrorResults = <T = unknown>(results: Array<Result<T>>) =>
  results.filter((result): result is ApplicationError => isErrorResult(result));

export const extractOkResults = <T = unknown>(results: Array<Result<T>>) =>
  filterOkResults(results).map(({ value }) => value);

export const isOkResults = <T = unknown>(results: Array<Result<T>>) =>
  results.some((result): result is Ok<T> => isOkResult(result));

export const hasErrorResults = <T = unknown>(results: Array<Result<T>>) =>
  filterErrorResults(results).length > 0;

//#endregion