import { describe, expect, it } from "vitest";
import { collect, wrapAsync, wrapSync } from "@/helpers";
import { Err, Ok, type Result } from "@/index";

describe("Result helpers", () => {
  describe("wrapSync", () => {
    it("should wrap successful function", () => {
      const result = wrapSync(() => 42);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(42);
    });

    it("should wrap throwing function", () => {
      const result = wrapSync(() => {
        throw new Error("test error");
      });
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("test error");
      }
    });
  });

  describe("wrapAsync", () => {
    it("should wrap successful promise", async () => {
      const result = await wrapAsync(Promise.resolve(42));
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(42);
    });

    it("should wrap rejected promise", async () => {
      const result = await wrapAsync(Promise.reject(new Error("test error")));
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("test error");
      }
    });
  });

  describe("collect", () => {
    it("should collect all Ok results", () => {
      const results = [Ok(1), Ok(2), Ok(3)];
      const collected = collect(results);
      expect(collected.isOk()).toBe(true);
      expect(collected.unwrap()).toEqual([1, 2, 3]);
    });

    it("should return first Err result", () => {
      const results = [Ok(1), Err("error"), Ok(3)];
      const collected = collect(results);
      expect(collected.isErr()).toBe(true);
      if (collected.isErr()) {
        expect(collected.error).toBe("error");
      }
    });

    it("should handle empty array", () => {
      const results: Result<number, string>[] = [];
      const collected = collect(results);
      expect(collected.isOk()).toBe(true);
      expect(collected.unwrap()).toEqual([]);
    });
  });
});
