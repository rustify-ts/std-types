import { describe, expect, it } from "vitest";
import { Err, Ok, Result } from "@/index";

describe("Result", () => {
  describe("Ok", () => {
    it("should create an Ok result", () => {
      const result = Ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.value).toBe(42);
    });

    it("should unwrap value", () => {
      const result = Ok(42);
      expect(result.unwrap()).toBe(42);
      expect(result.expect("should not throw")).toBe(42);
    });

    it("should return value with unwrapOr", () => {
      const result = Ok(42);
      expect(result.unwrapOr(0)).toBe(42);
    });

    it("should return value with unwrapOrElse", () => {
      const result = Ok(42);
      expect(result.unwrapOrElse(() => 0)).toBe(42);
    });

    it("should map value", () => {
      const result = Ok(42);
      const mapped = result.map((x) => x * 2);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(84);
    });

    it("should not map error with mapErr", () => {
      const result = Ok(42);
      const mapped = result.mapErr((e) => `Error: ${e}`);
      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(42);
    });

    it("should chain with and", () => {
      const result1 = Ok(42);
      const result2 = Ok("hello");
      const chained = result1.and(result2);
      expect(chained.isOk()).toBe(true);
      expect(chained.unwrap()).toBe("hello");
    });

    it("should chain with andThen", () => {
      const result = Ok(42);
      const chained = result.andThen((x) => Ok(x * 2));
      expect(chained.isOk()).toBe(true);
      expect(chained.unwrap()).toBe(84);
    });

    it("should return self with or", () => {
      const result1 = Ok(42);
      const result2 = Ok(100);
      const ored = result1.or(result2);
      expect(ored.isOk()).toBe(true);
      expect(ored.unwrap()).toBe(42);
    });

    it("should return self with orElse", () => {
      const result = Ok(42);
      const ored = result.orElse(() => Ok(100));
      expect(ored.isOk()).toBe(true);
      expect(ored.unwrap()).toBe(42);
    });
  });

  describe("Err", () => {
    it("should create an Err result", () => {
      const result = Err("error");
      expect(result.isOk()).toBe(false);
      expect(result.isErr()).toBe(true);
      expect(result.error).toBe("error");
    });

    it("should throw on unwrap", () => {
      const result = Err("error");
      expect(() => result.unwrap()).toThrow(
        "Called unwrap on an Err value: error",
      );
      expect(() => result.expect("custom message")).toThrow(
        "custom message: error",
      );
    });

    it("should return default with unwrapOr", () => {
      const result = Err("error");
      expect(result.unwrapOr(42)).toBe(42);
    });

    it("should return computed value with unwrapOrElse", () => {
      const result = Err("error");
      expect(result.unwrapOrElse((e) => `recovered from ${e}`)).toBe(
        "recovered from error",
      );
    });

    it("should not map value", () => {
      const result = Err("error");
      const mapped = result.map((x) => x * 2);
      expect(mapped.isErr()).toBe(true);
      if (mapped.isErr()) {
        expect(mapped.error).toBe("error");
      }
    });

    it("should map error with mapErr", () => {
      const result = Err("error");
      const mapped = result.mapErr((e) => `Error: ${e}`);
      expect(mapped.isErr()).toBe(true);
      if (mapped.isErr()) {
        expect(mapped.error).toBe("Error: error");
      }
    });

    it("should return self with and", () => {
      const result1 = Err("error");
      const result2 = Ok("hello");
      const chained = result1.and(result2);
      expect(chained.isErr()).toBe(true);
      if (chained.isErr()) {
        expect(chained.error).toBe("error");
      }
    });

    it("should return self with andThen", () => {
      const result = Err("error");
      const chained = result.andThen((x) => Ok(x * 2));
      expect(chained.isErr()).toBe(true);
      if (chained.isErr()) {
        expect(chained.error).toBe("error");
      }
    });

    it("should return other with or", () => {
      const result1 = Err("error");
      const result2 = Ok(42);
      const ored = result1.or(result2);
      expect(ored.isOk()).toBe(true);
      expect(ored.unwrap()).toBe(42);
    });

    it("should chain with orElse", () => {
      const result = Err("error");
      const ored = result.orElse(() => Ok(`recovered from error`));
      expect(ored.isOk()).toBe(true);
      expect(ored.unwrap()).toBe("recovered from error");
    });
  });

  describe("type narrowing", () => {
    it("should narrow types with isOk", () => {
      const result: Result<number, string> = Ok(42);
      if (result.isOk()) {
        expect(result.value).toBe(42);
      }
    });

    it("should narrow types with isErr", () => {
      const result: Result<number, string> = Err("error");
      if (result.isErr()) {
        expect(result.error).toBe("error");
      }
    });
  });

  describe("callable constructors", () => {
    it("should work without new keyword", () => {
      const okResult = Ok(42);
      const errResult = Err("error");

      expect(okResult).toBeInstanceOf(Result);
      expect(errResult).toBeInstanceOf(Result);
      expect(okResult.isOk()).toBe(true);
      expect(errResult.isErr()).toBe(true);
    });

    it("should have single Result class type", () => {
      const okResult = Ok(42);
      const errResult = Err("error");

      expect(okResult.constructor).toBe(Result);
      expect(errResult.constructor).toBe(Result);
    });
  });
});
