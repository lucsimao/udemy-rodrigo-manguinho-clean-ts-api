import { LoginController } from './login';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';

describe('Login Controller', () => {
  it('should return 400 when no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
