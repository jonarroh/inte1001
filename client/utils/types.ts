export interface Result<T, Err> {
  isOk: boolean;
  value?: T;
  error?: Err;
}