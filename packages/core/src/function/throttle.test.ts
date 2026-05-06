import {afterEach, describe, expect, it, vi} from 'vitest'

import throttle from './throttle'

afterEach(() => {
  vi.useRealTimers()
})

describe('throttle', () => {
  it('默认 leading + trailing 行为：首次立即执行，窗口结束后补最后一次', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled('first')
    throttled('second')
    throttled('third')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')

    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('third')
  })

  it('leading=false 时首次延后到等待时间后执行', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fn = vi.fn()
    const throttled = throttle(fn, 100, {leading: false})

    throttled('first')

    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(99)
    expect(fn).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')
  })

  it('trailing=false 时冷却期内忽略后续调用', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fn = vi.fn()
    const throttled = throttle(fn, 100, {trailing: false})

    throttled('first')
    throttled('second')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('first')

    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(1)
  })
})
