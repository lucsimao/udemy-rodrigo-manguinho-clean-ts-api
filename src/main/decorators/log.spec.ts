import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';
import { ok, serverError } from '../../presentation/helpers/http-helper';

import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';

const makeFakeRequest = () => {
  return {
    body: {
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };
};

const makeFakeAccount = () => {
  return {
    email: 'valid_email@mail.com',
    id: 'valid_id',
    name: 'valid_name',
    password: 'valid_password',
  };
};

const makeServerError = () => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

const makeLogErrorRepository = () => {
  class LogErrorRespositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LogErrorRespositoryStub();
};

const makeController = () => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok(makeFakeAccount())));
    }
  }

  const controllerStub = new ControllerStub();
  return controllerStub;
};

const makeSut = () => {
  const controllerStub = makeController();
  const logErrorRespositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRespositoryStub
  );
  return { sut, controllerStub, logErrorRespositoryStub };
};

describe('LogControllerDecorator', () => {
  it('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result as controller', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(ok(makeFakeAccount()));
  });

  it('should call LogErrorRespository with correct error when controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRespositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRespositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockResolvedValue(makeServerError());
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
