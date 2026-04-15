type EventHandler = (...args: unknown[]) => void

type StoredHandler = EventHandler & {origin?: EventHandler}

export default class EventsEmitter {
  private events: Map<string, Set<StoredHandler>>

  constructor() {
    this.events = new Map()
  }

  on(eventName: string, callback: EventHandler): this {
    let callbacks = this.events.get(eventName)
    if (!callbacks) {
      callbacks = new Set()
      this.events.set(eventName, callbacks)
    }
    callbacks.add(callback)

    return this
  }

  emit(eventName: string, ...args: unknown[]): boolean {
    const callbacks = this.events.get(eventName)
    if (!callbacks) return false

    const handles = [...callbacks]

    handles.forEach(fn => {
      fn(...args)
    })

    return true
  }

  off(eventName: string, callback: EventHandler): boolean {
    const callbacks = this.events.get(eventName)
    if (!callbacks) return false

    let removed = callbacks.delete(callback)

    if (!removed) {
      for (const fn of callbacks) {
        if (fn.origin === callback) {
          callbacks.delete(fn)
          removed = true
          break
        }
      }
    }

    if (callbacks.size === 0) {
      this.events.delete(eventName)
    }

    return true
  }

  once(eventName: string, callback: EventHandler): this {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const wrapperFn: StoredHandler = function (...args: unknown[]) {
      self.off(eventName, callback)
      callback.apply(this, args)
    }

    wrapperFn.origin = callback

    this.on(eventName, wrapperFn)

    return this
  }
}
