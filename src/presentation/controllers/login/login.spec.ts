import { EmailValidator, HttpRequest } from '../../protocols';
import { ILogin, LoginController } from './login';
import { InvalidParamError, MissingParamError } from '../../errors';

import { badRequest } from '../../helpers/http-helper';

const makeEmailValidator = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeFakeRequest = (): HttpRequest<ILogin> => {
  return {
    body: {
      email: 'any_email',
      password: 'any_password',
    },
  };
};

const makeSut = () => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
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
});
