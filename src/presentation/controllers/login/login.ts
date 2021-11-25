import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';
import { InvalidParamError, MissingParamError } from '../../errors';

import { badRequest } from '../../helpers/http-helper';

export interface ILogin {
  email: string;
  password: string;
}

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(
    httpRequest: HttpRequest<ILogin>
  ): Promise<HttpResponse<unknown>> {
    const { email, password } = httpRequest.body;
    if (!email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!password) {
      return badRequest(new MissingParamError('password'));
    }
    const isValid = this.emailValidator.isValid(email);
    if (!isValid) {
      return badRequest(new InvalidParamError('email'));
    }
    return badRequest(new InvalidParamError('emai32432423l'));
  }
}
