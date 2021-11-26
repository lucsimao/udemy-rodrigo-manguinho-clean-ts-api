import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { Controller } from '../../presentation/protocols';
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Validation } from '../../presentation/helpers/validators/validation';

export const makeSignUpController = (): Controller<unknown, unknown> => {
  const emailValidator = new EmailValidatorAdapter();
  const salt = 12;
  const encryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(encryptAdapter, accountMongoRepository);

  const signUpController = new SignUpController(
    emailValidator,
    dbAddAccount,
    {} as Validation
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
