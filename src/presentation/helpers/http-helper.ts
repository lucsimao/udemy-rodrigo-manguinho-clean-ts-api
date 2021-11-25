import { ServerError, UnauthorizedError } from '../errors';

import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: 200,
  body,
});
