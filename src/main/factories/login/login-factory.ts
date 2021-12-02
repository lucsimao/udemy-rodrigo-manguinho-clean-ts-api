import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter';
import { Controller } from '../../../presentation/protocols';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { JwtAdapter } from '../../../data/protocols/criptography/jwt-adapter/jwt-adapter.';
import { LogControllerDecorator } from '../../decorators/log-decorator';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import env from '../../config/env';
import { makeLoginInValidation } from './login-validation';

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginInValidation()
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
