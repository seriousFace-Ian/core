import {describe, expect, it, vi} from 'vitest'

import {clamp, formatNumber, random, round} from '.'

describe('math helpers', () => {
  it('clamp 将数值限制在边界内', () => {
    expect(clamp(10, 0, 100)).toBe(10)
    expect(clamp(-1, 0, 100)).toBe(0)
    expect(clamp(101, 0, 100)).toBe(100)
  })

  it('random 在给定范围内生成随机数', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(random(10, 20)).toBe(10)

    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(random(10, 20)).toBe(15)

    vi.restoreAllMocks()
  })

  it('round 按精度四舍五入', () => {
    expect(round(10.123456, 2)).toBe(10.12)
    expect(round(10.125, 2)).toBe(10.13)
    expect(round(1234.5, 0)).toBe(1235)
  })

  it('formatNumber 按分组格式化整数和小数', () => {
    expect(formatNumber(12009494)).toBe('12,009,494')
    expect(formatNumber(-1234.56)).toBe('-1,234.56')
    expect(formatNumber(12345678, 4)).toBe('1234,5678')
  })

  it('formatNumber 对非法 span 抛错，并保留非有限数值原样输出', () => {
    expect(() => formatNumber(1234, 0)).toThrow('span must be a positive integer')
    expect(() => formatNumber(1234, 1.5)).toThrow('span must be a positive integer')
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('Infinity')
    expect(formatNumber(Number.NaN)).toBe('NaN')
  })

  it('formatNumber 对科学计数法字符串保持原值', () => {
    expect(formatNumber(1e21)).toBe('1e+21')
    expect(formatNumber(1e-7)).toBe('1e-7')
  })
})
