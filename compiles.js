class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = document.querySelector(this.vm.$el);
    this.compile(this.el);
  }

  compile(el) {
    // 遍历this.el下的所有子节点(类数组)
    const nodeList = el.childNodes;
    // 将类数组转为数组进行遍历
    Array.from(nodeList).forEach((node) => {
      if (this.isElementNode(node)) { // 元素节点，需要判断指令
        this.compileElement(node)
      } else if (this.isTextNode(node)) { // 文本节点，需要编译差值表达式
        this.compileText(node)
      }

      // 当前node中存在子节点，递归complie方法去遍历它。直到内部无子节点为止
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    // 1.取出当前node的所有attribute（类数组）
    const attrs = node.attributes;
    Array.from(attrs).forEach((attr) => {
      // 2.检查每个attr是否是指令，如果是指令，则处理相关指令
      if (this.isDirective(attr.name)) {
        const directive = attr.name.substr(2); // v-text => text
        const key = attr.value;
        this.update(node, directive, key)
      }
    })
  }

  update(node, directive, key) {
    this[`${directive}Updater`](node, key)
  }

  textUpdater(node, key) {
    node.textContent = this.vm[key]
    new Watcher(this.vm, key, (value) => {
      console.log('值变化了', value)
      node.textContent = value
    })
  }

  modelUpdate(node, key) {
    node.value = this.vm[key];
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // 1.差值表达式正则匹配
    const reg = /\{\{(.+?)\}\}/
    // 2.获取node节点的文本值
    const value = node.textContent;
    // 3.正则匹配文本值，如果是差值表达式，则注入相关的值
    if (reg.test(value)) {
      const key = RegExp.$1.trim();
      node.textContent = node.textContent.replace(reg, this.vm[key])
    }
  }

  // 判断属性中是否具有指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  // 判断node是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  // 判断node是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}