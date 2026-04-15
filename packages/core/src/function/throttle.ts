type ThrottleBehavior = {
  leading?: boolean
  trailing?: boolean
}

type ThrottleOptions = [
  fn: (...args: unknown[]) => void,
  wait: number,
  behavior?: ThrottleBehavior,
]

export default function throttle(...args: ThrottleOptions) {
  const [fn, wait, behavior = {}] = args
  const { leading = true, trailing = true } = behavior

  let timer: ReturnType<typeof setTimeout> | undefined
  let lastInvokeTime: number | undefined
  let lastThis: unknown
  let lastArgs: unknown[] | undefined

  return function (this: unknown, ...args: unknown[]) {
    const now = Date.now()
    const sinceLastInvoke =
      lastInvokeTime === undefined ? Number.NaN : now - lastInvokeTime

    lastThis = this
    lastArgs = args

    const invokeFunc = (invokeThis: unknown, invokeArgs: unknown[]) => {
      lastInvokeTime = Date.now()

      fn.apply(invokeThis, invokeArgs)
    }

    if (!lastInvokeTime && leading) {
      invokeFunc(this, args)
    } else if (sinceLastInvoke >= wait) {
      if (timer) clearTimeout(timer)

      invokeFunc(this, args)
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        timer = undefined
        invokeFunc(lastThis, lastArgs ?? [])
      }, wait - sinceLastInvoke)
    }
  }
}
