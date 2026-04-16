import {describe, expect, it, vi} from 'vitest'

import {
  debounce,
  EventsEmitter,
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  throttle,
} from './index'

describe('is', () => {
  it('isString', () => {
    expect(isString('hello')).toBe(true)
    expect(isString(1)).toBe(false)
  })

  it('isNumber', () => {
    expect(isNumber(42)).toBe(true)
    expect(isNumber('42')).toBe(false)
  })

  it('isBoolean', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(0)).toBe(false)
  })

  it('isNull', () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
  })

  it('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
  })

  it('isFunction', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction({})).toBe(false)
  })

  it('isObject', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
  })

  it('isArray', () => {
    expect(isArray([])).toBe(true)
    expect(isArray({})).toBe(false)
  })
})

describe('debounce', () => {
  it('延迟执行', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('immediate 模式下首次立即执行', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100, true)

    debouncedFn()

    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)

    debouncedFn()
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })

  it('fn 不是函数时抛出错误', () => {
    expect(() => debounce('not a function' as never, 100)).toThrow('fn must be a function')
  })
})

describe('throttle', () => {
  it('leading 模式：首次立即执行，冷却期内只执行一次', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(100)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})

describe('EventsEmitter', () => {
  it('on / emit', () => {
    const emitter = new EventsEmitter()
    const fn = vi.fn()

    emitter.on('test', fn)
    emitter.emit('test', 1, 2)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1, 2)
  })

  it('off 移除监听', () => {
    const emitter = new EventsEmitter()
    const fn = vi.fn()

    emitter.on('test', fn)
    emitter.off('test', fn)
    emitter.emit('test')

    expect(fn).not.toHaveBeenCalled()
  })

  it('once 只触发一次', () => {
    const emitter = new EventsEmitter()
    const fn = vi.fn()

    emitter.once('test', fn)
    emitter.emit('test')
    emitter.emit('test')

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('emit 返回 false 若无监听', () => {
    const emitter = new EventsEmitter()
    expect(emitter.emit('none')).toBe(false)
  })
})
