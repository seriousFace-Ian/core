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
