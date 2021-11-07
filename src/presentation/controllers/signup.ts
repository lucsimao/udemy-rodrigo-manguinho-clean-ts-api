import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  User,
} from '../protocols';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

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
      if (
        httpRequest.body?.password !== httpRequest.body?.passwordConfirmation
      ) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
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
