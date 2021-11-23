import { HttpResponse } from '../protocols/http';
import { ServerError } from '../errors';

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: 200,
  body,
});
