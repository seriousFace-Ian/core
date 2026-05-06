import {afterEach, describe, expect, it, vi} from 'vitest'

import debounce from './debounce'

afterEach(() => {
  vi.useRealTimers()
})

describe('debounce', () => {
  it('在等待时间后只执行最后一次调用', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('first')
    debounced('second')
    debounced('third')

    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('third')
  })

  it('immediate 模式首次立即执行，冷却后再次触发', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100, true)

    debounced('first')
    debounced('second')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')

    await vi.advanceTimersByTimeAsync(100)

    debounced('third')

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('third')
  })

  it('保留调用时的 this 上下文', async () => {
    vi.useFakeTimers()
    const fn = vi.fn(function (this: {value: number}, increment: number) {
      return this.value + increment
    })
    const debounced = debounce(fn, 50)
    const context = {value: 2, run: debounced}

    context.run(3)
    await vi.advanceTimersByTimeAsync(50)

    expect(fn.mock.instances[0]).toBe(context)
    expect(fn).toHaveBeenCalledWith(3)
  })

  it('fn 不是函数时抛错', () => {
    expect(() => debounce('nope' as never, 100)).toThrow('fn must be a function')
  })
})
