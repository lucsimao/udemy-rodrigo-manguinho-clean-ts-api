import { InvalidParamError } from '../../errors';
import { Validation } from './validation';

export class CompareFieldsValidation implements Validation {
  constructor(private readonly fieldName, private readonly compareFieldName) {}

  validate(input: any): Error | undefined {
    if (input[this.fieldName] !== input[this.compareFieldName]) {
      return new InvalidParamError(this.compareFieldName);
    }
  }
}
