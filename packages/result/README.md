# @rustify/result

Pure TypeScript Result type inspired by Rust's Result enum for robust error handling.

## Installation

```bash
pnpm add @rustify/result
```

## Overview

The Result type represents the result of an operation that can either succeed or fail: every Result is either `Ok` and contains a success value, or `Err` and contains an error value. This provides a type-safe way to handle errors without exceptions.

## Basic Usage

```typescript
import { Result, Ok, Err } from '@rustify/result';

// Creating Results
const success = Ok("Hello, World!");
const failure = Err("Something went wrong");

// Type guards
if (success.isOk()) {
  console.log(success.value); // "Hello, World!" - type-safe access
}

if (failure.isErr()) {
  console.log(failure.error); // "Something went wrong"
}
```

## API Reference

### Creating Results

```typescript
// Create Ok variant
const result = Ok(value);

// Create Err variant
const result = Err(error);
```

### Type Guards

```typescript
result.isOk();  // true if Ok
result.isErr(); // true if Err
```

### Value and Error Access

```typescript
// Safe access to success value (throws if Err)
result.value; // getter property
result.unwrap(); // method equivalent

// Safe access to error (throws if Ok)
result.error; // getter property (only available on Err results)

// Safe access with defaults
result.unwrapOr(defaultValue);
result.unwrapOrElse(error => computedDefault);

// Safe access with custom error message
result.expect('Expected success');
```

### Transformations

```typescript
// Transform the success value if Ok
result.map(x => x.toUpperCase());

// Transform the error value if Err
result.mapErr(err => new CustomError(err));
```

### Combining Results

```typescript
const result1 = Ok(1);
const result2 = Ok(2);
const error = Err("failed");

// Returns second result if first is Ok, otherwise first error
result1.and(result2); // Ok(2)
result1.and(error);   // Err("failed")
error.and(result2);   // Err("failed")

// Flat map operation
result1.andThen(x => Ok(x * 2)); // Ok(2)
result1.andThen(x => Err("nope")); // Err("nope")

// Returns first result if Ok, otherwise second
result1.or(error);    // Ok(1)
error.or(result2);    // Ok(2)

// Lazy version of or
error.orElse(err => Ok(`recovered from ${err}`)); // Ok("recovered from failed")
```

## Helper Functions

```typescript
import { ok, err } from '@rustify/result/helpers';

// Convenience functions (from helpers module)
const result1 = ok(42);        // Same as Ok(42)
const result2 = err("failed"); // Same as Err("failed")
```

## Examples

### Safe Division

```typescript
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("Division by zero");
  }
  return Ok(a / b);
}

const result = safeDivide(10, 2)
  .map(x => x * 2)
  .unwrapOr(0);

console.log(result); // 10
```

### File Reading Simulation

```typescript
type FileError = "NotFound" | "PermissionDenied" | "IOError";

function readFile(path: string): Result<string, FileError> {
  if (!path.startsWith('/')) {
    return Err("NotFound");
  }
  if (path.includes('private')) {
    return Err("PermissionDenied");
  }
  return Ok(`Contents of ${path}`);
}

const content = readFile('/public/data.txt')
  .map(content => content.toUpperCase())
  .mapErr(error => `File error: ${error}`)
  .unwrapOr("Default content");

console.log(content); // "CONTENTS OF /PUBLIC/DATA.TXT"
```

### Chaining Operations

```typescript
function parseNumber(str: string): Result<number, string> {
  const parsed = parseFloat(str);
  return isNaN(parsed) ? Err("Invalid number") : Ok(parsed);
}

function sqrt(n: number): Result<number, string> {
  return n < 0 ? Err("Cannot take square root of negative number") : Ok(Math.sqrt(n));
}

const result = parseNumber("16")
  .andThen(sqrt)
  .map(x => Math.round(x * 100) / 100)
  .unwrapOr(-1);

console.log(result); // 4
```

### Error Recovery

```typescript
function tryMultipleApproaches(): Result<string, string[]> {
  const errors: string[] = [];
  
  return Err("Primary failed")
    .orElse(err => {
      errors.push(err);
      return Err("Secondary failed");
    })
    .orElse(err => {
      errors.push(err);
      return Ok("Fallback success");
    })
    .mapErr(() => errors);
}

const result = tryMultipleApproaches();
console.log(result); // Ok("Fallback success")
```

## Type Safety

The Result type provides complete type safety:

```typescript
const result: Result<number, string> = Ok(42);

// TypeScript knows this is safe
if (result.isOk()) {
  const value: number = result.value; // ✅ Type is number
}

if (result.isErr()) {
  const error: string = result.error; // ✅ Type is string
}

// TypeScript prevents unsafe access
// const unsafe = result.value; // ❌ Type error if not in type guard
```

## Comparison with Exceptions

### Traditional Exception Handling
```typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

try {
  const result = divide(10, 0);
  console.log(result);
} catch (error) {
  console.log("Error:", error.message);
}
```

### Result-based Error Handling
```typescript
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err("Division by zero");
  }
  return Ok(a / b);
}

const result = safeDivide(10, 0);
if (result.isErr()) {
  console.log("Error:", result.error);
} else {
  console.log("Result:", result.value);
}
```

## Features

- 🔒 **Type-safe**: Complete TypeScript support with proper type guards
- 🌳 **Tree-shakable**: ES modules with `sideEffects: false`
- 📦 **Zero dependencies**: Pure TypeScript implementation
- 🦀 **Rust-inspired**: Faithful implementation of Rust's Result type
- 🧪 **Well-tested**: Comprehensive test coverage
- ⚡ **No exceptions**: Explicit error handling without try-catch

## License

MIT