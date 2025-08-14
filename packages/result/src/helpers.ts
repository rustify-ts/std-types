import { Result } from "./index";

export const wrapAsync = async <T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> => {
  try {
    const value = await promise;
    return Result.ok(value);
  } catch (error) {
    return Result.err(error as E);
  }
};

export const wrapSync = <T, E = Error>(fn: () => T): Result<T, E> => {
  try {
    return Result.ok(fn());
  } catch (error) {
    return Result.err(error as E);
  }
};

export const collect = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const values: T[] = [];
  for (const result of results) {
    if (result.isErr()) {
      return result;
    }
    values.push(result.value);
  }
  return Result.ok(values);
};
