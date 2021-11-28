import { AddAccount, AddAccountModel, HttpRequest } from './signup-protocols';
import { MissingParamError, ServerError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';

import { AccountModel } from '../../../domain/models';
import { SignUpController } from './signup';
import { Validation } from '../../protocols/validation';

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

const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined;
    }
  }
  return new ValidationStub();
};

const makeSut = () => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,

    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
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

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest as any);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 when validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const httpRequest = makeFakeRequest();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));

    const httpResponse = await sut.handle(httpRequest as any);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    );
  });
});
