import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';

import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginInValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('email', new EmailValidatorAdapter()),
  ]);
};
