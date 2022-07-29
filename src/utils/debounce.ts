const debounce = <T extends (...args: any[]) => unknown>(callback: T, ms: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback, ms)
  }
}

export default debounce
