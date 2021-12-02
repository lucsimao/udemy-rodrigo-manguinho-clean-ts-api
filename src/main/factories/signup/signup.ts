import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-repository';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter';
import { Controller } from '../../../presentation/protocols';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { LogControllerDecorator } from '../../decorators/log-decorator';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller<unknown, unknown> => {
  const salt = 12;
  const HasherAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(HasherAdapter, accountMongoRepository);
  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
