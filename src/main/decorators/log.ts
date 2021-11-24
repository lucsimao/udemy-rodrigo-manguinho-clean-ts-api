import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols';

import { LogErrorRepository } from '../../data/protocols/log-error-repository';

export class LogControllerDecorator implements Controller<unknown, unknown> {
  constructor(
    private readonly controller: Controller<unknown, unknown>,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<unknown>
  ): Promise<HttpResponse<unknown>> {
    const result = await this.controller.handle(httpRequest);

    if (result.statusCode === 500) {
      const error = (result.body as Error).stack;
      await this.logErrorRepository.logError(error);
    }

    return result;
  }
}
