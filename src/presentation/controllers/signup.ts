import { HttpRequest, HttpResponse } from '../protocols/http';

import { Controller } from '../protocols/controller';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';

export interface IUser {
  name: string;
  email: string;
}
export class SignUpController implements Controller<IUser, Error> {
  handle(httpRequest: HttpRequest<IUser>): HttpResponse<Error> {
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
    return { statusCode: 400, body: new Error('') };
  }
}
