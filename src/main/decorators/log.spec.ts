import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';

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
      const result: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Rodrigo',
        },
      };
      return new Promise((resolve) => resolve(result));
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
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result as controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual({
      statusCode: 200,
      body: {
        name: 'Rodrigo',
      },
    });
  });

  it('should call LogErrorRespository with correct error when controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRespositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRespositoryStub, 'log');
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    jest
      .spyOn(controllerStub, 'handle')
      .mockResolvedValue(serverError(fakeError));
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const result = await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
