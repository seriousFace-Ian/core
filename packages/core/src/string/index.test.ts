import {describe, expect, it} from 'vitest'

import {camelCase, kebabCase, pascalCase} from '.'

describe('string case helpers', () => {
  it('camelCase 将 kebab-case 转为 camelCase', () => {
    expect(camelCase('first-name')).toBe('firstName')
    expect(camelCase('user-profile-name')).toBe('userProfileName')
  })

  it('kebabCase 将 camelCase 转为 kebab-case', () => {
    expect(kebabCase('firstName')).toBe('first-name')
    expect(kebabCase('URLValue')).toBe('-u-r-l-value')
  })

  it('pascalCase 兼容分隔符与大小写边界', () => {
    expect(pascalCase('foo bar')).toBe('FooBar')
    expect(pascalCase('foo_bar')).toBe('FooBar')
    expect(pascalCase('foo.bar')).toBe('FooBar')
    expect(pascalCase('fooBar')).toBe('FooBar')
    expect(pascalCase('  multi-word.value_here ')).toBe('MultiWordValueHere')
  })
})
