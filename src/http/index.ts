import { StatusCodes } from 'http-status-codes';
import { ApplicationError, ApplicationErrorCodes, effectiveResult, PromiseResult, isApplicationError } from '@/results';

const headers = ({ data, token }: { data?: unknown; token?: string }): HeadersInit => {
  const headers: HeadersInit = {
    //'Access-Control-Allow-Origin': 'http://localhost:3001/'
  };
  if (data && !(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

type QueryOptions = { credentials?: boolean; headers?: Record<string, string> };
type InputOptions<K> = { data?: K } & QueryOptions;
type Response<T> = { response: T; status: StatusCodes; statusText: string };

export const get = async <T extends Record<string, unknown> | string | number | null>(
  endpoint: string,
  options: QueryOptions = {}
): PromiseResult<Response<T>> => {
  return fetchOperation('GET', endpoint, options);
};

export const post = async <
  T extends Record<string, unknown> | string | number | null,
  K extends Record<string, unknown> | FormData = {}
>(
  endpoint: string,
  options: InputOptions<K> = {}
): PromiseResult<Response<T>> => {
  return fetchOperation('POST', endpoint, options);
};

const fetchOperation = async <T, K>(
  method: 'GET' | 'POST',
  endpoint: string,
  options: InputOptions<K> = {}
): PromiseResult<Response<T>> =>
    effectiveResult(async () => {
    const { data } = options;
    const customHeaders = options.headers ?? {};

    try {
      const config: Record<string, unknown> = {
        credentials: 'include', //options.credentials ? 'include' : 'omit',
        //mode: 'same-origin',
        method,
        headers: {
          ...headers({ data }),
          ...customHeaders
        }
      };

      if (data) {
        config.body = data instanceof FormData ? data : JSON.stringify(data);
      }

      const result = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`, config);

      if ([StatusCodes.ACCEPTED, StatusCodes.OK].includes(result.status)) {
        let response: string | number | Record<string, unknown> = await result.text();
        try {
          response = await JSON.parse(response);
        } catch (_err) {
          if (Number.isInteger(response)) {
            response = Number(response);
          }
        }
        return {
          response: response as T,
          status: result.status,
          statusText: result.statusText
        };
      } else {
        const response = (await result.json()) as { errorCode: string; description: string };
        const errorCode = (response.errorCode as ApplicationErrorCodes) || ApplicationErrorCodes.NETWORK_ERROR;
        const description = response.description || result.statusText;

        throw new ApplicationError(errorCode, description, { status: result.status });
      }
    } catch (error) {
      if (isApplicationError(error)) {
        throw error;
      }

      throw new ApplicationError(ApplicationErrorCodes.FETCH_ERROR, (error as Error).message);
    }
  });
