import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest, serverError } from '../helpers/http-helper';

import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { User } from '../protocols/user';

export class SignUpController implements Controller<User, Error> {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest<User>): HttpResponse<Error> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (httpRequest.body && !httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(
        httpRequest.body?.email || ''
      );

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      return { statusCode: 400, body: new Error('') };
    } catch (error) {
      return serverError();
    }
  }
}
