/**
 * Methods
 *  - setStorageItem
 *  - getStorageItem
 *  - removeStorageItem
 *  - clearStorage
 */

type StorageItem = {
  value: unknown
  meta: {
    createdAt: number
    expiresAt?: number // 优先级最高
    expiresIn?: number
  }
}

export function setStorageItem(
  key: string,
  value: unknown,
  options: {expiresIn?: number; expiresAt?: number}
): void | Error {
  const localStorage = window.localStorage

  if (!localStorage) {
    throw new Error('LocalStorage is not supported in current envrioment')
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      meta: {
        createdAt: Date.now(),
        expiresAt: options.expiresAt,
        expiresIn: options.expiresIn,
      },
    })
  )
}

export function getStorageItem(key: string): StorageItem | undefined {
  const localStorage = window.localStorage

  if (!localStorage) {
    throw new Error('LocalStorage is not supported in current envrioment')
  }

  const item = localStorage.getItem(key)
  if (!item) {
    return undefined
  }

  // validate expiresAt and expiresIn
  const data = JSON.parse(item) as StorageItem
  const now = Date.now()
  const {expiresAt, expiresIn} = data.meta

  if (expiresAt && expiresAt < now) return undefined

  if (expiresIn && now - data.meta.createdAt > expiresIn) return undefined

  return data
}

export function removeStorageItem(key: string): void {
  const localStorage = window.localStorage

  if (!localStorage) {
    throw new Error('LocalStorage is not supported in current envrioment')
  }

  localStorage.removeItem(key)
}

export function clearStorage(): void {
  const localStorage = window.localStorage

  if (!localStorage) {
    throw new Error('LocalStorage is not supported in current envrioment')
  }

  localStorage.clear()
}
