// Single Result class with discriminated union
class Result<T, E> {
  private constructor(
    private readonly _isOk: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  // Static factory methods
  static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value, undefined);
  }

  static err<E>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  // Type guards
  isOk(): this is Result<T, never> {
    return this._isOk;
  }

  isErr(): this is Result<never, E> {
    return !this._isOk;
  }

  // Getters for value and error (type-safe)
  get value(): T {
    if (!this._isOk) {
      throw new Error("Called value on an Err result");
    }
    return this._value!;
  }

  get error(): E {
    if (this._isOk) {
      throw new Error("Called error on an Ok result");
    }
    return this._error!;
  }

  // Readonly ok property for compatibility
  get ok(): boolean {
    return this._isOk;
  }

  // Core methods
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isOk) {
      return Result.ok(fn(this._value!));
    }
    return this as any;
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    if (this._isOk) {
      return this as any;
    }
    return Result.err(fn(this._error!));
  }

  and<U>(other: Result<U, E>): Result<U, E> {
    if (this._isOk) {
      return other;
    }
    return this as any;
  }

  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    if (this._isOk) {
      return fn(this._value!);
    }
    return this as any;
  }

  or<U>(other: Result<U, E>): Result<T | U, E> {
    if (this._isOk) {
      return this as any;
    }
    return other as any;
  }

  orElse<U, F>(fn: (error: E) => Result<U, F>): Result<T | U, F> {
    if (this._isOk) {
      return this as any;
    }
    return fn(this._error!);
  }

  unwrap(): T {
    if (this._isOk) {
      return this._value!;
    }
    throw new Error(`Called unwrap on an Err value: ${this._error}`);
  }

  unwrapOr<U>(defaultValue: U): T | U {
    if (this._isOk) {
      return this._value!;
    }
    return defaultValue;
  }

  unwrapOrElse<U>(fn: (error: E) => U): T | U {
    if (this._isOk) {
      return this._value!;
    }
    return fn(this._error!);
  }

  expect(message: string): T {
    if (this._isOk) {
      return this._value!;
    }
    throw new Error(`${message}: ${this._error}`);
  }
}

export const Ok = Result.ok;
export const Err = Result.err;

// Export the Result class and create type alias
export { Result };
