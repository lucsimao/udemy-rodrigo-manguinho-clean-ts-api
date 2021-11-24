export interface LogErrorRepository {
  logError(stack: string | undefined): Promise<void>;
}
