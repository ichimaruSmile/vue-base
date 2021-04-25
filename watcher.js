// 如果compile编译到指令或差值表达式，则生成一个watcher。后续值修改的时候使用watcher进行更新
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;

    Dep.target = this;
    this.oldValue = vm[key]
    Dep.target = null;
  }

  update() {
    const newValue = this.vm[this.key];
    console.log('old', this.oldValue, 'new', newValue)
    if (this.oldValue === this.newValue) return
    this.oldValue = newValue;
    this.cb(newValue);
  }
}