import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  User,
} from './signup-protocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';

import { AccountModel } from './../../../domain/models/account';
import { ok } from './../../helpers/http-helper';

export class SignUpController
  implements Controller<User, Error | AccountModel>
{
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(
    httpRequest: HttpRequest<User>
  ): Promise<HttpResponse<Error | AccountModel>> {
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
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
      const account = await this.addAccount.add({ name, email, password });
      return ok<AccountModel>(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
