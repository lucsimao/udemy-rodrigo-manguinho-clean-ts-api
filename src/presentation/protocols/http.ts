export interface HttpResponse<T> {
  statusCode: number;
  body: T;
  headers?: [{ [key: string]: unknown }];
}

export interface HttpRequest<T> {
  body?: T;
}
