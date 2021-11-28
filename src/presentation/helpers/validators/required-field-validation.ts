import { MissingParamError } from '../../errors';
import { Validation } from './validation';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName) {}

  validate(input: any): Error | undefined {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
  }
}
