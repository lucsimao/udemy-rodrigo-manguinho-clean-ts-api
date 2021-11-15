import { HttpRequest, HttpResponse } from './index';

export interface Controller<T, K> {
  handle(httpRequest: HttpRequest<T>): Promise<HttpResponse<K>>;
}
