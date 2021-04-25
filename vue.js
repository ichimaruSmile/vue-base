class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;

    // 设置this代理以便于访问this.data
    // [场景]通过this.data.[some]取值太麻烦, 需要设置this代理访问this.data
    // this.data.name => this.name
    this.proxyThisData(this.$data)

    // 1.将options.data中的所有数据设置为响应式(observe.js)
    new Observe(this.$data);

    // 2.遍历dom节点
    new Compiler(this)
  }

  // 设置this代理this.data.
  proxyThisData(data) {
    // 1.取出data对象中所有的key
    const keys = Object.keys(data);
    // 2.将所有的数据做代理设置。只需要做一层
    keys.forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          console.log('get data by this proxy', `[${key}]`)
          return data[key]
        },
        set(value) {
          if (value === data[key]) return;
          console.log('set data by this proxy', `[${key}]`)
          data[key] = value
        }
      })
    })
  }
}