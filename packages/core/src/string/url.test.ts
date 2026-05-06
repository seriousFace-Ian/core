import {describe, expect, it} from 'vitest'

import url from './url'

describe('url helpers', () => {
  it('parse 解析 query string', () => {
    expect(url.parse('?name=ian&city=shanghai')).toEqual({
      name: 'ian',
      city: 'shanghai',
    })
    expect(url.parse('name=ian')).toEqual({name: 'ian'})
  })

  it('stringify 序列化对象为 query string', () => {
    expect(url.stringify({name: 'ian', city: 'shanghai'})).toBe('name=ian&city=shanghai')
  })
})
