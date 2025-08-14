// Single Option class with discriminated union
class Option<T> {
  private constructor(
    private readonly _isSome: boolean,
    private readonly _value?: T,
  ) {}

  // Static factory methods
  static some<T>(value: T): Option<T> {
    return new Option<T>(true, value);
  }

  static none<T = never>(): Option<T> {
    return new Option<T>(false, undefined);
  }

  // Type guards
  isSome(): this is Option<T> {
    return this._isSome;
  }

  isNone(): this is Option<never> {
    return !this._isSome;
  }

  // Getter for value (type-safe)
  get value(): T {
    if (!this._isSome) {
      throw new Error("Called value on a None option");
    }
    return this._value!;
  }

  // Core methods
  map<U>(fn: (value: T) => U): Option<U> {
    if (this._isSome) {
      return Option.some(fn(this._value!));
    }
    return Option.none<U>();
  }

  mapOr<U>(defaultValue: U, fn: (value: T) => U): U {
    if (this._isSome) {
      return fn(this._value!);
    }
    return defaultValue;
  }

  mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U {
    if (this._isSome) {
      return fn(this._value!);
    }
    return defaultFn();
  }

  and<U>(other: Option<U>): Option<U> {
    if (this._isSome) {
      return other;
    }
    return Option.none<U>();
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    if (this._isSome) {
      return fn(this._value!);
    }
    return Option.none<U>();
  }

  or(other: Option<T>): Option<T> {
    if (this._isSome) {
      return this;
    }
    return other;
  }

  orElse(fn: () => Option<T>): Option<T> {
    if (this._isSome) {
      return this;
    }
    return fn();
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (this._isSome && predicate(this._value!)) {
      return this;
    }
    return Option.none<T>();
  }

  unwrap(): T {
    if (this._isSome) {
      return this._value!;
    }
    throw new Error("Called unwrap on a None value");
  }

  unwrapOr<U>(defaultValue: U): T | U {
    if (this._isSome) {
      return this._value!;
    }
    return defaultValue;
  }

  unwrapOrElse<U>(fn: () => U): T | U {
    if (this._isSome) {
      return this._value!;
    }
    return fn();
  }

  expect(message: string): T {
    if (this._isSome) {
      return this._value!;
    }
    throw new Error(message);
  }

  // Convert to nullable
  toNullable(): T | null {
    return this._isSome ? this._value! : null;
  }

  toUndefined(): T | undefined {
    return this._isSome ? this._value! : undefined;
  }

  // Static factory from nullable
  static fromNullable<T>(value: T | null | undefined): Option<T> {
    return value != null ? Option.some(value) : Option.none<T>();
  }
}

export const Some = Option.some;
export const None = Option.none;

// Export the Option class
export { Option };
