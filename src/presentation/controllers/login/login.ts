import { Controller, HttpRequest, HttpResponse } from '../../protocols';

import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';

export class LoginController implements Controller {
  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<unknown>> {
    return badRequest(new MissingParamError('email'));
  }
}
