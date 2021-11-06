export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid Param: ${paramName} `);
    this.name = 'Invalid Param Error';
  }
}
