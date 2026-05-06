import {describe, expect, it} from 'vitest'

import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isUndefined,
  parseType,
} from '.'

describe('is helpers', () => {
  it('正确判断基础类型与引用类型', () => {
    expect(isString('hello')).toBe(true)
    expect(isNumber(42)).toBe(true)
    expect(isBoolean(false)).toBe(true)
    expect(isNull(null)).toBe(true)
    expect(isUndefined(undefined)).toBe(true)
    expect(isSymbol(Symbol('id'))).toBe(true)
    expect(isFunction(() => {})).toBe(true)
    expect(isObject({})).toBe(true)
    expect(isArray([])).toBe(true)
  })

  it('对非目标类型返回 false', () => {
    expect(isString(1)).toBe(false)
    expect(isNumber('42')).toBe(false)
    expect(isBoolean(0)).toBe(false)
    expect(isNull(undefined)).toBe(false)
    expect(isUndefined(null)).toBe(false)
    expect(isSymbol('symbol')).toBe(false)
    expect(isFunction({})).toBe(false)
    expect(isObject([])).toBe(false)
    expect(isArray({})).toBe(false)
  })

  it('parseType 返回统一的小写类型名', () => {
    expect(parseType(new Date())).toBe('date')
    expect(parseType(/core/)).toBe('regexp')
    expect(parseType(new Map())).toBe('map')
  })
})
