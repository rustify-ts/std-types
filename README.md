# @rustify/std-types

TypeScript standard types inspired by Rust's powerful type system.

## Overview

This monorepo provides TypeScript implementations of Rust's essential types for error handling and null-safe programming. It includes:

- **[@rustify/option](./packages/option)** - Pure TypeScript Option type for null-safe programming
- **[@rustify/result](./packages/result)** - Pure TypeScript Result type for robust error handling

## Features

- 🦀 **Rust-inspired**: Faithful TypeScript implementation of Rust's Option and Result types
- 🔒 **Type-safe**: Full TypeScript support with proper type guards and inference
- 🌳 **Tree-shakable**: ES modules with sideEffects: false
- 📦 **Zero dependencies**: Pure TypeScript with no external runtime dependencies
- 🧪 **Well-tested**: Comprehensive test coverage
- 🔧 **Modern tooling**: Built with Vite, tested with Vitest, linted with Biome

## Installation

```bash
# Install both packages
pnpm add @rustify/option @rustify/result

# Or install individually
pnpm add @rustify/option
pnpm add @rustify/result
```

## Quick Start

### Option Type
```typescript
import { Option, Some, None } from '@rustify/option';

// Create options
const value = Some(42);
const empty = None();

// Safe operations
const doubled = value.map(x => x * 2); // Some(84)
const result = value.unwrapOr(0); // 42
```

### Result Type
```typescript
import { Result, Ok, Err } from '@rustify/result';

// Create results
const success = Ok("Hello");
const failure = Err("Something went wrong");

// Safe error handling
const processed = success.map(s => s.toUpperCase()); // Ok("HELLO")
const fallback = failure.unwrapOr("Default"); // "Default"
```

## Development

This project uses pnpm workspaces for managing the monorepo.

### Setup
```bash
pnpm install
```

### Build all packages
```bash
pnpm build
```

### Test all packages
```bash
pnpm test
```

### Development mode (watch)
```bash
pnpm dev
```

### Linting and formatting
```bash
pnpm lint
pnpm format
```

## Requirements

- Node.js >= 22.0.0
- pnpm >= 10.13.1

## License

MIT