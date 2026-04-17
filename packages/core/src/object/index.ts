/**
 * Support types: Basic \ Reference \ Date \ RegExp \ Error \ Map \ Set \ Symbol
 * Keep original Prototype
 * Keep circle Reference
 *
 * seen record circle reference avoid stack overflow
 */
export function deepClone<T>(data: T, seen = new WeakMap<object, unknown>()): T {
  if (data === null || typeof data !== 'object') return data

  // handle circle reference
  if (seen.has(data as object)) {
    return seen.get(data as object) as T
  }

  // Date
  if (data instanceof Date) {
    return new Date(data.getTime()) as T
  }

  // RegExp
  if (data instanceof RegExp) {
    const cloneReg = new RegExp(data.source, data.flags)
    cloneReg.lastIndex = data.lastIndex

    return cloneReg as T
  }

  // Error
  if (data instanceof Error) {
    const cloned = new (data.constructor as ErrorConstructor)(data.message)
    cloned.name = data.name
    if (data.stack !== undefined) {
      cloned.stack = data.stack
    }
    return cloned as T
  }

  // Set
  if (data instanceof Set) {
    const cloned = new Set()
    seen.set(data, cloned)
    data.forEach(v => {
      cloned.add(deepClone(v, seen))
    })

    return cloned as T
  }

  // Map
  if (data instanceof Map) {
    const cloned = new Map()
    seen.set(data, cloned)
    data.forEach((value, key) => {
      cloned.set(key, deepClone(value, seen))
    })

    return cloned as T
  }

  // Array
  if (Array.isArray(data)) {
    const cloned: unknown[] = []
    seen.set(data, cloned)

    data.forEach((v, i) => {
      cloned[i] = deepClone(v, seen)
    })

    return cloned as T
  }

  // handle Object type
  // 避免丢失原型链
  const cloned = Object.create(Object.getPrototypeOf(data))
  seen.set(data as object, cloned)

  // handle string key + symbol key
  const keys = [...Object.getOwnPropertyNames(data), ...Object.getOwnPropertySymbols(data)]

  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(data, key)!
    // keep getter/setter
    if (descriptor.get || descriptor.set) {
      Object.defineProperty(cloned, key, descriptor)
    } else {
      descriptor.value = deepClone(descriptor.value, seen)
      Object.defineProperty(cloned, key, descriptor)
    }
  }

  return cloned as T
}

export function pick<T extends object, K extends keyof T>(data: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = data[key] as T[K]
    }
  }
  return result
}

export function omit<T extends object, K extends keyof T>(data: T, keys: K[]): Omit<T, K> {
  const result = {} as Record<string, unknown>
  const keySet = new Set<unknown>(keys)

  for (const key of Object.keys(data) as K[]) {
    if (!keySet.has(key)) {
      result[key as string] = data[key]
    }
  }

  return result as Omit<T, K>
}

/**
 * Safely set a nestd value on an object by path (mutates in place)
 * Auto-creates intermediate nodes: numeric keys create arrays, others create objects.
 *
 * @example
 * set({}, 'a.b.c', 1)           // → { a: { b: { c: 1 } } }
 * set({}, 'a[0].b', true)       // → { a: [{ b: true }] }
 * set({}, 'a[0][1]', 'x')       // → { a: [[undefined, 'x']] }
 */
export function safeSet<T extends object>(data: T, path: string, value: unknown): T {
  const keys = parsePath(path)

  if (keys.length === 0) return data

  let current: Record<string, unknown> = data as unknown as Record<string, unknown>

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = key[i + 1]
    const nextIsIndex = /^\d+$/.test(nextKey)

    if (current[key] === null || typeof current[key] !== 'object') {
      current[key] = nextIsIndex ? [] : {}
    }

    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value

  return data
}

/**
 * Safely get a nested value from an object by path (returns undefined if not found).
 *
 * @example
 * safeGet({ a: { b: { c: 1 } } }, 'a.b.c')  // → 1
 */
export function safeGet<T = unknown>(data: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = parsePath(path)
  let current: unknown = data

  for (const key of keys) {
    if (current === null || typeof current !== 'object') return defaultValue

    current = (current as Record<string, unknown>)[key]
  }

  return current === undefined ? defaultValue : (current as T)
}

/**
 * Deep merge multiple objects into a single object.
 *
 * @example
 * merge({ a: 1 }, { b: 2 }, { c: 3 })  // → { a: 1, b: 2, c: 3 }
 */
export function merge<T extends object>(...sources: Partial<T>[]): T {
  const result = {} as Record<string, unknown>
  for (const source of sources) {
    if (!isPlainObject(source)) continue
    for (const key of Object.keys(source)) {
      if (UNSAFE_KEYS.has(key)) continue
      const targetVal = result[key]
      const sourceVal = (source as Record<string, unknown>)[key]
      if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        result[key] = merge(targetVal, sourceVal)
      } else {
        result[key] = sourceVal
      }
    }
  }
  return result as T
}

/** ******* Utils *********/

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Check if a value is a plain object (i.e., not a DOM element or other non-object types).
 *
 * @example
 * isPlainObject({})          // → true
 * isPlainObject(new Date())  // → false
 * isPlainObject(new Error()) // → false
 * isPlainObject(new Map())   // → false
 * isPlainObject(new Set())   // → false
 * isPlainObject(new Proxy({}, {})) // → false
 */
function isPlainObject(val: unknown): val is Record<string, unknown> {
  if (val === null || typeof val !== 'object') return false
  const proto = Object.getPrototypeOf(val)
  return proto === Object.prototype || proto === null
}

/**
 * Parse a path string into an array of string keys.
 * Supports dot notation and bracket notation
 *
 * e.g. 'a.b[0].c' → ['a', 'b', '0', 'c']
 */
function parsePath(path: string): string[] {
  return path.match(/[^.[\]]+/g) ?? []
}
