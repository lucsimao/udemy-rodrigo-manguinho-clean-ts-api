export interface HttpResponse<T = unknown> {
  statusCode: number;
  body: T;
  headers?: [{ [key: string]: unknown }];
}

export interface HttpRequest<T = unknown> {
  body: T;
}
