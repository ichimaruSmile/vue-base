class Observe {
  constructor(data) {
    // 将data内所有数据设置为响应式
    this.walk(data)
  }

  // 遍历walk对象中的key
  walk(data) {
    if (!data || typeof data !== 'object') return

    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(data, key, __value) {
    const dep = new Dep()
    // 这里的__value是data[key], 是一个值的引用而不是值本身
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 需要__value参数，因为设置的代理就是被代理对象本身
        // 如果return data[key]，就会引起无限get
        console.log('get data', `[${key}]`)
        if (Dep.target) {
          dep.addSubs(Dep.target)
        }
        return __value
      },
      set(newValue) {
        if (__value === newValue) return
        console.log('set data', `[${key}]`)
        // __value为闭包数据，getter中return __value
        __value = newValue;
        // 发送通知
        dep.notify()
      }
    })
  }
}