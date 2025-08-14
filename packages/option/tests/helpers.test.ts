import { describe, it, expect } from 'vitest'
import { Option, Some, None } from '@/index'
import { collect, transpose, findSome, wrapSync, wrapAsync } from '@/helpers'

describe('Option helpers', () => {
  describe('collect', () => {
    it('collects all Some values', () => {
      const options = [Some(1), Some(2), Some(3)]
      const result = collect(options)
      expect(result.isSome()).toBe(true)
      expect(result.value).toEqual([1, 2, 3])
    })

    it('returns None if any option is None', () => {
      const options = [Some(1), None<number>(), Some(3)]
      const result = collect(options)
      expect(result.isNone()).toBe(true)
    })

    it('returns Some empty array for empty input', () => {
      const options: Option<number>[] = []
      const result = collect(options)
      expect(result.isSome()).toBe(true)
      expect(result.value).toEqual([])
    })
  })

  describe('transpose', () => {
    it('extracts all Some values', () => {
      const options = [Some(1), None<number>(), Some(3)]
      const result = transpose(options)
      expect(result).toEqual([1, 3])
    })

    it('returns empty array for all None', () => {
      const options = [None<number>(), None<number>()]
      const result = transpose(options)
      expect(result).toEqual([])
    })
  })

  describe('findSome', () => {
    it('finds first Some value', () => {
      const options = [None<number>(), Some(42), Some(84)]
      const result = findSome(options)
      expect(result.isSome()).toBe(true)
      expect(result.value).toBe(42)
    })

    it('returns None if no Some found', () => {
      const options = [None<number>(), None<number>()]
      const result = findSome(options)
      expect(result.isNone()).toBe(true)
    })
  })

  describe('wrapSync', () => {
    it('wraps successful function call', () => {
      const result = wrapSync(() => 42)
      expect(result.isSome()).toBe(true)
      expect(result.value).toBe(42)
    })

    it('wraps throwing function call', () => {
      const result = wrapSync(() => { throw new Error('test') })
      expect(result.isNone()).toBe(true)
    })
  })

  describe('wrapAsync', () => {
    it('wraps successful promise', async () => {
      const result = await wrapAsync(Promise.resolve(42))
      expect(result.isSome()).toBe(true)
      expect(result.value).toBe(42)
    })

    it('wraps rejecting promise', async () => {
      const result = await wrapAsync(Promise.reject(new Error('test')))
      expect(result.isNone()).toBe(true)
    })
  })
})