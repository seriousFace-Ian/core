type DebounceOptions = [fn: (...args: unknown[]) => void, wait: number, immediate?: boolean]

export default function debounce(...args: DebounceOptions) {
  const [fn, wait, immediate = false] = args

  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw new Error('fn must be a function')
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  return function (...args) {
    const callNow = immediate && !timer

    clearTimeout(timer)

    timer = setTimeout(() => {
      timer = undefined

      if (!immediate) {
        fn.apply(this, args)
      }
    }, wait)

    if (callNow) {
      fn.apply(this, args)
    }
  }
}
