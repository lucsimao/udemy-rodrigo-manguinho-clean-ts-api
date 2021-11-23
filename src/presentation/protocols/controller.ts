import { HttpRequest, HttpResponse } from './index';

export interface Controller<T = unknown, K = unknown> {
  handle(httpRequest: HttpRequest<T>): Promise<HttpResponse<K>>;
}
