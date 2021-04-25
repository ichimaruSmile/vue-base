class Dep {
  constructor() {
    this.subs = []
  }

  addSubs(watcher) {
    if (watcher && watcher.update) {
      this.subs.push(watcher)
    }
  }

  notify() {
    this.subs.forEach((item) => item.update())
  }
}