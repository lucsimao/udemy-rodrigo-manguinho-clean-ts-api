import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';

import { Authentication } from '../../../domain/use-cases/authentication';
import { Validation } from '../../protocols/validation';

export interface ILogin {
  email: string;
  password: string;
}

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(
    httpRequest: HttpRequest<ILogin>
  ): Promise<HttpResponse<unknown>> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth(email, password);
      if (accessToken === '') {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
