/**
 * Methods
 *  - clamp
 *  - random
 *  - round
 *  - formatNumber
 */

/**
 * Control input value in the scope
 * @example
 * Input: 10 0 100
 * Output: 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

/**
 * @example
 * Input: 0 100
 * Output: 0-100 random number
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * @example
 * Input: 10.123456 2
 * Output: 10.12
 */
export function round(value: number, precision: number): number {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
}

/**
 * 从个位起每 `span` 位分一组，用逗号分隔（默认三位一组）
 *
 * @example
 * formatNumber(12009494) // "12,009,494"
 * formatNumber(-1234.56, 3) // "-1,234.56"
 */
export function formatNumber(value: number, span = 3): string {
  if (!Number.isFinite(value)) {
    return String(value)
  }
  if (!Number.isInteger(span) || span < 1) {
    throw new RangeError('span must be a positive integer')
  }

  const negative = value < 0
  const absStr = Math.abs(value).toString()
  if (/e/i.test(absStr)) {
    return String(value)
  }

  const dot = absStr.indexOf('.')
  const intStr = dot === -1 ? absStr : absStr.slice(0, dot)
  const frac = dot === -1 ? '' : absStr.slice(dot)

  const rev = intStr.split('').reverse()
  const groups: string[] = []
  for (let i = 0; i < rev.length; i += span) {
    groups.push(
      rev
        .slice(i, i + span)
        .reverse()
        .join('')
    )
  }
  const formattedInt = groups.reverse().join(',')

  return (negative ? '-' : '') + formattedInt + frac
}
