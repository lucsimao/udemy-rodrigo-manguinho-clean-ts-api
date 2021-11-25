import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../../protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';

import { Authentication } from '../../../domain/use-cases/authentication';

export interface ILogin {
  email: string;
  password: string;
}

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(
    httpRequest: HttpRequest<ILogin>
  ): Promise<HttpResponse<unknown>> {
    try {
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
      await this.authentication.auth(email, password);
      return badRequest(new InvalidParamError('emai32432423l'));
    } catch (error) {
      return serverError(error);
    }
  }
}
