import { ServerError } from '../errors';
import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error,
});

export const serverError = (): HttpResponse<Error> => ({
  statusCode: 500,
  body: new ServerError(),
});

export const ok = <T>(body: T): HttpResponse<T> => ({
  statusCode: 200,
  body,
});
