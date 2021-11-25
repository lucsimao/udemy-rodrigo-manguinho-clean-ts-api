import { ILogin, LoginController } from './login';

import { HttpRequest } from '../../protocols';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';

const makeSut = () => {
  const sut = new LoginController();
  return { sut };
};

describe('Login Controller', () => {
  it('should return 400 when no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      } as Partial<ILogin>,
    };

    const httpResponse = await sut.handle(httpRequest as HttpRequest<ILogin>);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 when no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
      } as Partial<ILogin>,
    };

    const httpResponse = await sut.handle(httpRequest as HttpRequest<ILogin>);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
