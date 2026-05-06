/**
 * Methods
 *  - parse
 *  - stringify
 */

/**
 * Handle URL parameters parse
 * @example
 * Input: https://www.example.com?name=ian&age=21
 * Output: {name: 'ian', age: '21'}
 */
function parse(url: string): string {
  const data = url[0] === '?' ? url.slice(1) : url

  const pairs = data.split('&').map(pair => pair.split('='))
  return Object.fromEntries(pairs)
}

/**
 * transform object to URL parameters
 * @example
 * Input: {name: 'ian', age: '21'}
 * Ouput: name=ian&age=21
 */
function stringify(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export default {
  parse,
  stringify,
}
