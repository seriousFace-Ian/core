export default function debounce<T extends unknown[]>(
  fn: (...args: T) => unknown,
  wait: number,
  immediate = false
) {
  if (Object.prototype.toString.call(fn) !== '[object Function]') {
    throw new Error('fn must be a function')
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  return function (this: unknown, ...args: T) {
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
