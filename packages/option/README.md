# @rustify/option

Pure TypeScript Option type inspired by Rust's Option enum for null-safe programming.

## Installation

```bash
pnpm add @rustify/option
```

## Overview

The Option type represents an optional value: every Option is either `Some` and contains a value, or `None` and does not. This eliminates null reference errors at compile time by making the possibility of absence explicit in the type system.

## Basic Usage

```typescript
import { Option, Some, None } from '@rustify/option';

// Creating Options
const someValue = Some(42);
const noValue = None();

// Type guards
if (someValue.isSome()) {
  console.log(someValue.value); // 42 - type-safe access
}

if (noValue.isNone()) {
  console.log('No value present');
}
```

## API Reference

### Creating Options

```typescript
// Create Some variant
const option = Some(value);

// Create None variant
const option = None();

// From nullable values
const option = Option.fromNullable(nullableValue);
```

### Type Guards

```typescript
option.isSome(); // true if Some
option.isNone(); // true if None
```

### Value Access

```typescript
// Safe access (throws if None)
option.value; // getter property
option.unwrap(); // method equivalent

// Safe access with default
option.unwrapOr(defaultValue);
option.unwrapOrElse(() => computedDefault);

// Safe access with custom error message
option.expect('Expected a value');
```

### Transformations

```typescript
// Transform the value if present
option.map(x => x * 2);

// Transform with default
option.mapOr(0, x => x * 2);
option.mapOrElse(() => 0, x => x * 2);

// Filter based on predicate
option.filter(x => x > 10);
```

### Combining Options

```typescript
const option1 = Some(1);
const option2 = Some(2);
const none = None();

// Returns second option if first is Some, otherwise None
option1.and(option2); // Some(2)
none.and(option2);    // None

// Flat map operation
option1.andThen(x => Some(x * 2)); // Some(2)

// Returns first option if Some, otherwise second
option1.or(none);     // Some(1)
none.or(option2);     // Some(2)

// Lazy version of or
none.orElse(() => Some(42)); // Some(42)
```

### Conversion

```typescript
// Convert to nullable types
option.toNullable();  // T | null
option.toUndefined(); // T | undefined
```

## Helper Functions

```typescript
import { some, none } from '@rustify/option/helpers';

// Convenience functions (from helpers module)
const result1 = some(42);      // Same as Some(42)
const result2 = none();        // Same as None()
```

## Examples

### Parsing with Option

```typescript
function parseInteger(str: string): Option<number> {
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? None() : Some(parsed);
}

const result = parseInteger("42")
  .map(x => x * 2)
  .filter(x => x > 50)
  .unwrapOr(0);

console.log(result); // 84
```

### Working with Arrays

```typescript
function findFirst<T>(arr: T[], predicate: (item: T) => boolean): Option<T> {
  const found = arr.find(predicate);
  return Option.fromNullable(found);
}

const numbers = [1, 2, 3, 4, 5];
const evenNumber = findFirst(numbers, x => x % 2 === 0);

if (evenNumber.isSome()) {
  console.log(`First even number: ${evenNumber.value}`);
}
```

### Chaining Operations

```typescript
function safeDivide(a: number, b: number): Option<number> {
  return b === 0 ? None() : Some(a / b);
}

const result = Some(10)
  .andThen(x => safeDivide(x, 2))  // Some(5)
  .andThen(x => safeDivide(x, 0))  // None
  .map(x => x * 2)                 // None
  .unwrapOr(-1);

console.log(result); // -1
```

## Type Safety

The Option type provides complete type safety:

```typescript
const option: Option<number> = Some(42);

// TypeScript knows this is safe
if (option.isSome()) {
  const value: number = option.value; // ✅ Type is number
}

// TypeScript prevents unsafe access
// const unsafe = option.value; // ❌ Type error if not in type guard
```

## Features

- 🔒 **Type-safe**: Complete TypeScript support with proper type guards
- 🌳 **Tree-shakable**: ES modules with `sideEffects: false`
- 📦 **Zero dependencies**: Pure TypeScript implementation
- 🦀 **Rust-inspired**: Faithful implementation of Rust's Option type
- 🧪 **Well-tested**: Comprehensive test coverage

## License

MIT