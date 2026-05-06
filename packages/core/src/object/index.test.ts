import {describe, expect, it} from 'vitest'

import {deepClone, merge, omit, pick, safeGet, safeSet} from '.'

describe('deepClone', () => {
  it('深拷贝基础对象并保留原型、symbol 与循环引用', () => {
    const symbolKey = Symbol('token')

    class Person {
      constructor(public name: string) {}

      greet() {
        return `hi ${this.name}`
      }
    }

    const source = new Person('ian') as Person & {
      profile: {skills: string[]}
      self?: unknown
      [symbolKey]: {enabled: boolean}
    }

    source.profile = {skills: ['ts']}
    source[symbolKey] = {enabled: true}
    source.self = source

    const cloned = deepClone(source)

    expect(cloned).not.toBe(source)
    expect(cloned).toBeInstanceOf(Person)
    expect(cloned.greet()).toBe('hi ian')
    expect(cloned.profile).not.toBe(source.profile)
    expect(cloned.profile.skills).not.toBe(source.profile.skills)
    expect(cloned.profile.skills).toEqual(['ts'])
    expect(cloned[symbolKey]).not.toBe(source[symbolKey])
    expect(cloned[symbolKey]).toEqual({enabled: true})
    expect(cloned.self).toBe(cloned)
  })

  it('深拷贝 Date、RegExp、Error、Map 与 Set', () => {
    const date = new Date('2026-01-01T00:00:00.000Z')
    const regexp = /core/gi
    regexp.lastIndex = 2
    const error = new TypeError('boom')
    error.stack = 'stack'

    const source = {
      date,
      regexp,
      error,
      map: new Map([['user', {name: 'ian'}]]),
      set: new Set([{id: 1}]),
    }

    const cloned = deepClone(source)

    expect(cloned.date).not.toBe(date)
    expect(cloned.date.getTime()).toBe(date.getTime())
    expect(cloned.regexp).not.toBe(regexp)
    expect(cloned.regexp.source).toBe(regexp.source)
    expect(cloned.regexp.flags).toBe(regexp.flags)
    expect(cloned.regexp.lastIndex).toBe(2)
    expect(cloned.error).toBeInstanceOf(TypeError)
    expect(cloned.error).not.toBe(error)
    expect(cloned.error.message).toBe('boom')
    expect(cloned.error.stack).toBe('stack')
    expect(cloned.map).not.toBe(source.map)
    expect(cloned.map.get('user')).toEqual({name: 'ian'})
    expect(cloned.map.get('user')).not.toBe(source.map.get('user'))

    const [clonedSetValue] = [...cloned.set]
    const [sourceSetValue] = [...source.set]
    expect(clonedSetValue).toEqual({id: 1})
    expect(clonedSetValue).not.toBe(sourceSetValue)
  })
})

describe('pick', () => {
  it('返回指定 key 的子集并忽略不存在的 key', () => {
    const source = {name: 'ian', age: 18, city: 'shanghai'}

    expect(pick(source, ['name', 'age'])).toEqual({name: 'ian', age: 18})
    expect(pick(source, ['name', 'missing' as keyof typeof source])).toEqual({name: 'ian'})
  })
})

describe('omit', () => {
  it('移除指定 key 并保留其他可枚举属性', () => {
    const source = {name: 'ian', age: 18, city: 'shanghai'}

    expect(omit(source, ['age'])).toEqual({name: 'ian', city: 'shanghai'})
  })
})

describe('safeSet', () => {
  it('根据路径创建嵌套对象', () => {
    const target = {}

    safeSet(target, 'user.profile.name', 'ian')

    expect(target).toEqual({
      user: {
        profile: {
          name: 'ian',
        },
      },
    })
  })

  it('根据数字路径片段创建数组', () => {
    const target = {}

    safeSet(target, 'list[0].name', 'core')

    expect(target).toEqual({
      list: [
        {
          name: 'core',
        },
      ],
    })
  })

  it('空路径不做修改', () => {
    const target = {name: 'ian'}

    expect(safeSet(target, '', 'ignored')).toBe(target)
    expect(target).toEqual({name: 'ian'})
  })
})

describe('safeGet', () => {
  it('读取嵌套路径值', () => {
    const source = {
      user: {
        profile: {
          name: 'ian',
        },
      },
      list: [{name: 'core'}],
    }

    expect(safeGet(source, 'user.profile.name')).toBe('ian')
    expect(safeGet(source, 'list[0].name')).toBe('core')
  })

  it('路径不存在时返回默认值', () => {
    const source = {user: null}

    expect(safeGet(source, 'user.profile.name', 'fallback')).toBe('fallback')
    expect(safeGet(source, 'missing.path')).toBeUndefined()
  })
})

describe('merge', () => {
  it('深度合并普通对象', () => {
    const merged = merge(
      {user: {name: 'ian', profile: {age: 18}}},
      {user: {profile: {city: 'shanghai'}}, active: true}
    )

    expect(merged).toEqual({
      user: {
        name: 'ian',
        profile: {
          age: 18,
          city: 'shanghai',
        },
      },
      active: true,
    })
  })

  it('忽略原型污染相关 key', () => {
    const polluted = JSON.parse('{"__proto__":{"polluted":true},"safe":1}')

    const result = merge(polluted)

    expect(result).toEqual({safe: 1})
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
