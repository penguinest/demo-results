export const ApplicationErrors = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  AUTHORIZED: 'AUTHORIZED',
  FETCH_ERROR: 'FETCH_ERROR',
  MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN: 'UNKNOWN'
} as const;

export type ApplicationErrors = typeof ApplicationErrors[keyof typeof ApplicationErrors];

export type ApplicationErrorCodes = ApplicationErrors;

export const ApplicationErrorCodes = {
  ...ApplicationErrors
} as const;
