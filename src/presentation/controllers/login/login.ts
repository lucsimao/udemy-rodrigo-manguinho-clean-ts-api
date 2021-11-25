import { Controller, HttpRequest, HttpResponse } from '../../protocols';

import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';

export interface ILogin {
  email: string;
  password: string;
}

export class LoginController implements Controller {
  async handle(
    httpRequest: HttpRequest<ILogin>
  ): Promise<HttpResponse<unknown>> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    return badRequest(new MissingParamError('password'));
  }
}
