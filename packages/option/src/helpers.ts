import { Option } from "./index";

/**
 * Wraps a synchronous function that might throw into an Option
 */
export const wrapSync = <T>(fn: () => T): Option<T> => {
  try {
    const value = fn();
    return Option.some(value);
  } catch {
    return Option.none;
  }
};

/**
 * Wraps an async function that might throw into a Promise<Option<T>>
 */
export const wrapAsync = async <T>(promise: Promise<T>): Promise<Option<T>> => {
  try {
    const value = await promise;
    return Option.some(value);
  } catch {
    return Option.none;
  }
};

/**
 * Collects an array of Options into an Option of array
 * Returns Some([...values]) if all Options are Some, None otherwise
 */
export const collect = <T>(options: Option<T>[]): Option<T[]> => {
  const values: T[] = [];

  for (const option of options) {
    if (option.isSome()) {
      values.push(option.value);
    } else {
      return Option.none;
    }
  }

  return Option.some(values);
};

/**
 * Transpose Option<T[]> to T[]
 * Filters out None values and extracts Some values
 */
export const transpose = <T>(options: Option<T>[]): T[] => {
  return options
    .filter((option) => option.isSome())
    .map((option) => option.value);
};

/**
 * Find the first Some value in an array of Options
 */
export const findSome = <T>(options: Option<T>[]): Option<T> => {
  for (const option of options) {
    if (option.isSome()) {
      return option;
    }
  }
  return Option.none;
};
