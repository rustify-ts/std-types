import { describe, expect, it } from "vitest";
import { None, Option, Some } from "../src/index";

describe("Option", () => {
  describe("creation", () => {
    it("creates Some value", () => {
      const opt = Some(42);
      expect(opt.isSome()).toBe(true);
      expect(opt.isNone()).toBe(false);
      expect(opt.value).toBe(42);
    });

    it("creates None value", () => {
      const opt = None;
      expect(opt.isSome()).toBe(false);
      expect(opt.isNone()).toBe(true);
    });

    it("creates from nullable - with value", () => {
      const opt = Option.fromNullable(42);
      expect(opt.isSome()).toBe(true);
      expect(opt.value).toBe(42);
    });

    it("creates from nullable - with null", () => {
      const opt = Option.fromNullable(null);
      expect(opt.isNone()).toBe(true);
    });

    it("creates from nullable - with undefined", () => {
      const opt = Option.fromNullable(undefined);
      expect(opt.isNone()).toBe(true);
    });
  });

  describe("map operations", () => {
    it("maps Some value", () => {
      const opt = Some(42);
      const mapped = opt.map((x) => x * 2);
      expect(mapped.isSome()).toBe(true);
      expect(mapped.value).toBe(84);
    });

    it("maps None value", () => {
      const opt = None;
      const mapped = opt.map((x) => x * 2);
      expect(mapped.isNone()).toBe(true);
    });

    it("mapOr with Some", () => {
      const opt = Some(42);
      const result = opt.mapOr(0, (x) => x * 2);
      expect(result).toBe(84);
    });

    it("mapOr with None", () => {
      const opt = None;
      const result = opt.mapOr(0, (x) => x * 2);
      expect(result).toBe(0);
    });

    it("mapOrElse with Some", () => {
      const opt = Some(42);
      const result = opt.mapOrElse(
        () => 0,
        (x) => x * 2,
      );
      expect(result).toBe(84);
    });

    it("mapOrElse with None", () => {
      const opt = None;
      const result = opt.mapOrElse(
        () => 0,
        (x) => x * 2,
      );
      expect(result).toBe(0);
    });
  });

  describe("chaining operations", () => {
    it("and with two Some values", () => {
      const opt1 = Some(42);
      const opt2 = Some("hello");
      const result = opt1.and(opt2);
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe("hello");
    });

    it("and with Some and None", () => {
      const opt1 = Some(42);
      const opt2 = None;
      const result = opt1.and(opt2);
      expect(result.isNone()).toBe(true);
    });

    it("and with None and Some", () => {
      const opt1 = None;
      const opt2 = Some("hello");
      const result = opt1.and(opt2);
      expect(result.isNone()).toBe(true);
    });

    it("andThen with Some", () => {
      const opt = Some(42);
      const result = opt.andThen((x) => Some(x.toString()));
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe("42");
    });

    it("andThen with None", () => {
      const opt: Option<number> = None;
      const result = opt.andThen((x) => Some(x.toString()));
      expect(result.isNone()).toBe(true);
    });

    it("or with Some and None", () => {
      const opt1 = Some(42);
      const opt2 = None;
      const result = opt1.or(opt2);
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe(42);
    });

    it("or with None and Some", () => {
      const opt1 = None;
      const opt2 = Some(42);
      const result = opt1.or(opt2);
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe(42);
    });

    it("orElse with Some", () => {
      const opt = Some(42);
      const result = opt.orElse(() => Some(0));
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe(42);
    });

    it("orElse with None", () => {
      const opt = None;
      const result = opt.orElse(() => Some(0));
      expect(result.isSome()).toBe(true);
      expect(result.value).toBe(0);
    });
  });

  describe("filter", () => {
    it("filters Some value that matches predicate", () => {
      const opt = Some(42);
      const filtered = opt.filter((x) => x > 10);
      expect(filtered.isSome()).toBe(true);
      expect(filtered.value).toBe(42);
    });

    it("filters Some value that does not match predicate", () => {
      const opt = Some(5);
      const filtered = opt.filter((x) => x > 10);
      expect(filtered.isNone()).toBe(true);
    });

    it("filters None value", () => {
      const opt = None;
      const filtered = opt.filter((x) => x > 10);
      expect(filtered.isNone()).toBe(true);
    });
  });

  describe("unwrapping", () => {
    it("unwraps Some value", () => {
      const opt = Some(42);
      expect(opt.unwrap()).toBe(42);
    });

    it("throws when unwrapping None", () => {
      const opt = None;
      expect(() => opt.unwrap()).toThrow("Called unwrap on a None value");
    });

    it("unwrapOr with Some", () => {
      const opt = Some(42);
      expect(opt.unwrapOr(0)).toBe(42);
    });

    it("unwrapOr with None", () => {
      const opt = None;
      expect(opt.unwrapOr(0)).toBe(0);
    });

    it("unwrapOrElse with Some", () => {
      const opt = Some(42);
      expect(opt.unwrapOrElse(() => 0)).toBe(42);
    });

    it("unwrapOrElse with None", () => {
      const opt = None;
      expect(opt.unwrapOrElse(() => 0)).toBe(0);
    });

    it("expect with Some", () => {
      const opt = Some(42);
      expect(opt.expect("should have value")).toBe(42);
    });

    it("expect with None throws with message", () => {
      const opt = None;
      expect(() => opt.expect("should have value")).toThrow(
        "should have value",
      );
    });
  });

  describe("conversion", () => {
    it("converts Some to nullable", () => {
      const opt = Some(42);
      expect(opt.toNullable()).toBe(42);
    });

    it("converts None to nullable", () => {
      const opt = None;
      expect(opt.toNullable()).toBe(null);
    });

    it("converts Some to undefined", () => {
      const opt = Some(42);
      expect(opt.toUndefined()).toBe(42);
    });

    it("converts None to undefined", () => {
      const opt = None;
      expect(opt.toUndefined()).toBe(undefined);
    });
  });
});
