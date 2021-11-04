import { HttpRequest } from '../protocols/http';
import { MissingParamError } from '../protocols/missing-param-error';

export interface IUser {
  name: string;
  email: string;
}
export class SignUpController {
  handle(httpRequest: HttpRequest<IUser>): any {
    if (!httpRequest.body?.name) {
      return { statusCode: 400, body: new MissingParamError('name') };
    }
    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError('email') };
    }
  }
}
