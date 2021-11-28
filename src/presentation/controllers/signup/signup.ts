import {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  User,
} from './signup-protocols';
import { badRequest, serverError } from '../../helpers/http-helper';

import { AccountModel } from './../../../domain/models/account';
import { InvalidParamError } from '../../errors';
import { Validation } from '../../helpers/validators/validation';
import { ok } from './../../helpers/http-helper';

export class SignUpController
  implements Controller<User, Error | AccountModel>
{
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  async handle(
    httpRequest: HttpRequest<User>
  ): Promise<HttpResponse<Error | AccountModel>> {
    try {
      const error = this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
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
