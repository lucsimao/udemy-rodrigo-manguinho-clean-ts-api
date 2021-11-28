import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { InvalidParamError } from '../../errors';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidatorAdapter
  ) {}

  validate(input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(input[this.fieldName]);
    }
  }
}
