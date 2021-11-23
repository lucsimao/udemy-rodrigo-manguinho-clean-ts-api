import {
  AddAccount,
  AddAccountModel,
  EmailValidator,
  HttpRequest,
} from './signup-protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

import { AccountModel } from '../../../domain/models';
import { SignUpController } from './signup';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeFakeAccount = () => {
  return {
    email: 'valid_email@mail.com',
    id: 'valid_id',
    name: 'valid_name',
    password: 'valid_password',
  };
};

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 when no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return 400 when no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 when no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 when no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    );
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    );
  });

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest as any);

    expect(isValidSpy).toBeCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(
      serverError(new ServerError(new Error().stack))
    );
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((_, reject) => reject(new Error()));
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(
      serverError(new ServerError(new Error().stack))
    );
  });

  test('Should call AddAccount with correct Values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest as any);

    expect(addSpy).toBeCalledWith({
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password',
    });
  });

  test('Should return 200 when valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
