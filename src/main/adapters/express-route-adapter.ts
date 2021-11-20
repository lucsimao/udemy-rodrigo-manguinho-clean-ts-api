import { Controller, HttpRequest } from '../../presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = <T, K>(controller: Controller<T, K>) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest<T> = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
