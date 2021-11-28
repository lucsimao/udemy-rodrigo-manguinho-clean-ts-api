import {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  User,
} from './signup-protocols';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';

import { AccountModel } from './../../../domain/models/account';
import { Validation } from '../../helpers/validators/validation';

export class SignUpController
  implements Controller<User, Error | AccountModel>
{
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
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

      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });
      return ok<AccountModel>(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
