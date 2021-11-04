import { HttpRequest } from '../protocols/http';
import { MissingParamError } from '../protocols/missing-param-error';
import { badRequest } from '../helpers/http-helper';

export interface IUser {
  name: string;
  email: string;
}
export class SignUpController {
  handle(httpRequest: HttpRequest<IUser>): any {
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields) {
      if (httpRequest.body && !httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
