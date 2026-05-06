export function isString(value: unknown): boolean {
  return parseType(value) === 'string'
}

export function isNumber(value: unknown): boolean {
  return parseType(value) === 'number'
}

export function isBoolean(value: unknown): boolean {
  return parseType(value) === 'boolean'
}

export function isNull(value: unknown): boolean {
  return parseType(value) === 'null'
}

export function isUndefined(value: unknown): boolean {
  return parseType(value) === 'undefined'
}

export function isSymbol(value: unknown): boolean {
  return parseType(value) === 'symbol'
}

export function isFunction(value: unknown): boolean {
  return parseType(value) === 'function'
}

export function isObject(value: unknown): boolean {
  return parseType(value) === 'object'
}

export function isArray(value: unknown): boolean {
  return parseType(value) === 'array'
}

export function parseType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
