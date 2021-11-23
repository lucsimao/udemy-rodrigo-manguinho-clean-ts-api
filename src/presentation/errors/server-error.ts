export class ServerError extends Error {
  constructor(stack: string | undefined) {
    super(`Internal server error`);
    this.name = 'Server Error';
    this.stack = stack;
  }
}
