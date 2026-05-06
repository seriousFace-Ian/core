export default function throttle<T extends unknown[]>(
  fn: (...args: T) => unknown,
  wait: number,
  behavior: {leading?: boolean; trailing?: boolean} = {}
) {
  const {leading = true, trailing = true} = behavior

  let timer: ReturnType<typeof setTimeout> | undefined
  let lastInvokeTime: number | undefined
  let firstCallTime: number | undefined
  let lastThis: unknown
  let lastArgs: T | undefined

  return function (this: unknown, ...args: T) {
    const now = Date.now()

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this
    lastArgs = args

    const invokeFunc = (invokeThis: unknown, invokeArgs: T) => {
      lastInvokeTime = Date.now()
      firstCallTime = undefined

      fn.apply(invokeThis, invokeArgs)
    }

    if (lastInvokeTime === undefined && leading) {
      invokeFunc(this, args)
      return
    }

    if (lastInvokeTime !== undefined && now - lastInvokeTime >= wait) {
      if (timer) clearTimeout(timer)

      invokeFunc(this, args)
      return
    }

    if (!trailing || timer) return

    if (firstCallTime === undefined) {
      firstCallTime = now
    }

    const baseTime = lastInvokeTime ?? firstCallTime
    const remaining = Math.max(wait - (now - baseTime), 0)

    timer = setTimeout(() => {
      timer = undefined
      invokeFunc(lastThis, lastArgs ?? ([] as unknown as T))
    }, remaining)
  }
}
