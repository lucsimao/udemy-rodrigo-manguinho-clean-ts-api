import { EmailValidator, HttpRequest } from '../../protocols';
import { ILogin, LoginController } from './login';
import { InvalidParamError, MissingParamError } from '../../errors';
import {
  badRequest,
  serverError,
  unauthorized,
} from '../../helpers/http-helper';

import { Authentication } from '../../../domain/use-cases/authentication';

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

const makeFakeRequest = (): HttpRequest<ILogin> => {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    },
  };
};

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return { sut, emailValidatorStub, authenticationStub };
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

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest as HttpRequest<ILogin>);
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email);
  });

  it('should return 400 when an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 when email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('');
    });
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(authSpy).toBeCalledWith('any_email@mail.com', 'any_password');
  });

  it('should return 401 when invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce('');
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });
});
