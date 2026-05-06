import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {getStorageItem, removeStorageItem, setStorageItem} from '.'

function createMockLocalStorage() {
  const store = new Map<string, string>()
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value)
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key)
    }),
    clear: vi.fn(() => store.clear()),
    _store: store,
  }
}

let mockStorage: ReturnType<typeof createMockLocalStorage>

beforeEach(() => {
  mockStorage = createMockLocalStorage()

  // Mount 'window' variable on Global
  vi.stubGlobal('window', {localStorage: mockStorage})
})

afterEach(() => {
  vi.unstubAllGlobals()
  // clear all timers
  vi.useRealTimers()
})

describe('setStorageItem', () => {
  it('写入 value 与 meta 到 localStorage', () => {
    vi.setSystemTime(new Date('2026-04-19T00:00:00Z'))

    setStorageItem('user', {name: 'ian'}, {})

    expect(mockStorage.setItem).toHaveBeenCalledTimes(1)
    const [key, raw] = mockStorage.setItem.mock.calls[0]
    expect(key).toBe('user')
    expect(JSON.parse(raw)).toEqual({
      value: {name: 'ian'},
      meta: {
        createdAt: new Date('2026-04-19T00:00:00Z').getTime(),
        expiresAt: undefined,
        expiresIn: undefined,
      },
    })
  })

  it('localStorage 不存在时抛错', () => {
    vi.stubGlobal('window', {})
    expect(() => setStorageItem('k', 'v', {})).toThrow('LocalStorage is not supported')
  })
})

describe('getStorageItem', () => {
  it('读取已写入的值，不设置过期时间', () => {
    setStorageItem('token', 'abc', {})
    const item = getStorageItem('token')
    expect(item?.value).toBe('abc')
  })

  it('key 不存在时返回 undefined', () => {
    expect(getStorageItem('missing')).toBeUndefined()
  })

  it('expiresAt 已过期返回 undefined', () => {
    const expired = {
      value: 'x',
      meta: {createdAt: 0, expiresAt: 100},
    }
    mockStorage._store.set('k', JSON.stringify(expired))
    vi.setSystemTime(200)

    expect(getStorageItem('k')).toBeUndefined()
  })

  it('expiresAt 未过期正常返回', () => {
    const valid = {
      value: 'x',
      meta: {createdAt: 0, expiresAt: 500},
    }
    mockStorage._store.set('k', JSON.stringify(valid))
    vi.setSystemTime(200)

    expect(getStorageItem('k')?.value).toBe('x')
  })

  it('expiresIn 超时返回 undefined', () => {
    const item = {
      value: 'x',
      meta: {createdAt: 0, expiresIn: 100},
    }
    mockStorage._store.set('k', JSON.stringify(item))
    vi.setSystemTime(500)

    expect(getStorageItem('k')).toBeUndefined()
  })
})

describe('removeStorageItem', () => {
  it('移除指定 key', () => {
    setStorageItem('k', 'v', {})
    removeStorageItem('k')

    expect(mockStorage.removeItem).toHaveBeenCalledWith('k')
    expect(getStorageItem('k')).toBeUndefined()
  })
})
