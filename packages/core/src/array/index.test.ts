import {describe, expect, it} from 'vitest'

import {chunk, difference, flatten, groupBy, intersection, unique} from '.'

describe('array helpers', () => {
  it('chunk 按指定大小拆分数组', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(chunk(['a', 'b'], 5)).toEqual([['a', 'b']])
  })

  it('flatten 递归打平嵌套数组', () => {
    expect(flatten([1, [2, [3, 4]], 5] as unknown[])).toEqual([1, 2, 3, 4, 5])
    expect(flatten([])).toEqual([])
  })

  it('unique 去重并保留首次出现顺序', () => {
    expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4])
  })

  it('groupBy 按指定 key 分组', () => {
    const data = [
      {name: 'Alice', role: 'admin'},
      {name: 'Bob', role: 'user'},
      {name: 'Carol', role: 'admin'},
    ]

    expect(groupBy(data, 'role')).toEqual({
      admin: [
        {name: 'Alice', role: 'admin'},
        {name: 'Carol', role: 'admin'},
      ],
      user: [{name: 'Bob', role: 'user'}],
    })
  })

  it('difference 返回仅存在于第一个数组中的元素', () => {
    expect(difference([1, 2, 3, 4], [3, 4, 5])).toEqual([1, 2])
    expect(difference(['a', 'b'], ['a'])).toEqual(['b'])
  })

  it('intersection 返回两个数组的交集，并保留第一个数组的顺序', () => {
    expect(intersection([3, 1, 2, 4], [2, 4, 6])).toEqual([2, 4])
    expect(intersection(['a', 'b', 'c'], ['c', 'a'])).toEqual(['a', 'c'])
  })
})
