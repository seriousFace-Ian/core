/**
 * transform KebabCase to  CamelCase
 *
 * @example
 * camelCase(first-name) -> fristName
 */
export function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * transform CamelCase to KebabCase
 *
 * @example
 * kebabCase(firstName) -> first-name
 */
export function kebabCase(str: string): string {
  return str.replace(/(?=[A-Z])/g, '-').toLowerCase()
}

/**
 * Split on `-` / `_` / whitespace / `.`, and on `aA` boundaries, then capitalize each word.
 *
 * @example
 * pascalCase('fooBar'); // -> FooBar
 * pascalCase('foo bar'); // -> FooBar
 * pascalCase('foo_bar'); // -> FooBar
 * pascalCase('foo.bar'); // -> FooBar
 */
export function pascalCase(str: string): string {
  const words = str
    .trim()
    .replace(/[-_\s.]+/g, ' ')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)

  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
}
