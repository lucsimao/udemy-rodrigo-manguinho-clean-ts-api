export interface LogErrorRepository {
  log(stack: string | undefined): Promise<void>;
}
