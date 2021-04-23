class Observe {
  constructor(data) {
    // 将data内所有数据设置为响应式
    this.walk(data)
  }

  // 遍历walk对象中的key
  walk(data) {
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(target, key, __value) {
    // 这里的__value是data[key], 是一个值的引用而不是值本身
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 需要value参数，因为设置的代理就是被代理对象本身
        // 如果return target[key]，就会引起无限get
        console.log('get data', `[${key}]`)
        return __value
      },
      set(newValue) {
        if (__value === newValue) return
        console.log('set data', `[${key}]`)
        // 因为__value引用自data[key], 所以这里将newValue赋值给__value = newValue赋值给data[key]
        __value = newValue;
      }
    })
  }
}