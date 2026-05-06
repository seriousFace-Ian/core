import {describe, expect, it, vi} from 'vitest'

import EventsEmitter from '.'

describe('EventsEmitter', () => {
  it('on 与 emit 按参数触发监听函数', () => {
    const emitter = new EventsEmitter()
    const handler = vi.fn()

    emitter.on('message', handler)

    expect(emitter.emit('message', 1, 'two')).toBe(true)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1, 'two')
  })

  it('off 移除已注册监听并返回 true', () => {
    const emitter = new EventsEmitter()
    const handler = vi.fn()

    emitter.on('message', handler)

    expect(emitter.off('message', handler)).toBe(true)
    expect(emitter.emit('message')).toBe(false)
    expect(handler).not.toHaveBeenCalled()
  })

  it('off 对不存在的事件或监听返回 false', () => {
    const emitter = new EventsEmitter()
    const handler = vi.fn()

    emitter.on('message', handler)

    expect(emitter.off('missing', handler)).toBe(false)
    expect(emitter.off('message', vi.fn())).toBe(false)
  })

  it('once 注册的监听只触发一次，并支持用原始函数 off', () => {
    const emitter = new EventsEmitter()
    const handler = vi.fn()

    emitter.once('message', handler)
    expect(emitter.off('message', handler)).toBe(true)
    expect(emitter.emit('message')).toBe(false)

    emitter.once('message', handler)
    emitter.emit('message', 'payload')
    emitter.emit('message', 'ignored')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('payload')
  })

  it('removeAllListeners 清空所有事件监听', () => {
    const emitter = new EventsEmitter()
    const first = vi.fn()
    const second = vi.fn()

    emitter.on('a', first)
    emitter.on('b', second)

    emitter.removeAllListeners()

    expect(emitter.emit('a')).toBe(false)
    expect(emitter.emit('b')).toBe(false)
    expect(first).not.toHaveBeenCalled()
    expect(second).not.toHaveBeenCalled()
  })
})
