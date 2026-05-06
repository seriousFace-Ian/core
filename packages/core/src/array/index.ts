/**
 * Methods
 *  - chunk
 *  - flatten
 *  - unique
 *  - groupBy
 *  - difference
 *  - intersection
 */

/**
 * @example
 * Input: [1,2,3,4,5,6,7] 2
 * Output: [[1,2], [3,4], [5,6], [7]]
 */
export function chunk<T>(data: T[], size: number): T[][] {
  return data.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(item)
    return acc
  }, [] as T[][])
}

/**
 * @example
 * Input: [[1,2], [3,4], [5,6], [7]]
 * Output: [1,2,3,4,5,6,7]
 */
export function flatten<T>(data: T[]): T[] {
  return data.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item))
    }
    return acc.concat(item)
  }, [] as T[])
}

export function unique<T>(data: T[]): T[] {
  return [...new Set(data)]
}

/**
 * GroupBy Array by item key name
 * @example
 * Input: [
 *  { name: 'Alice', role: 'admin' },
 *  { name: 'Bob', role: 'user' },
 *  { name: 'Carol', role: 'admin' },
 * ]
 * Output: {
 *   admin: [
 *     { name: 'Alice', role: 'admin' },
 *     { name: 'Carol', role: 'admin' },
 *   ],
 *   user: [{ name: 'Bob', role: 'user' }],
 * }
 */
export function groupBy<T>(data: T[], key: string): Record<string, T[]> {
  return data.reduce(
    (acc, item) => {
      const groupKey = (item as Record<string, unknown>)[key]
      if (!acc[groupKey as string]) {
        acc[groupKey as string] = []
      }
      acc[groupKey as string].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

/**
 * @example
 * Input: [1,2,3,4,5] [3,4,5,6,7]
 * Output: [1,2]
 */
export function difference<T>(a: T[], b: T[]): T[] {
  const set = new Set(b)
  return a.filter(item => !set.has(item))
}

/**
 * @example
 * Input: [1,2,3,4,5] [3,4,5,6,7]
 * Output: [3,4,5]
 */
export function intersection<T>(a: T[], b: T[]): T[] {
  const set = new Set(b)
  return a.filter(item => set.has(item))
}
