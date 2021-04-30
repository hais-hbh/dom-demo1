window.dom = {
  create (string) {
    const container = document.createElement("template")
    container.innerHTML = string.trim()
    return container.content.firstChild
    //<template><div></div></template>
    //返回的是里面的那个div，不是整个template
  },
  after (oldNode, newNode) {
    oldNode.parentNode.insertBefore(newNode, oldNode.nextSibling)
    //找到存在节点的父亲节点，在这个节点的下一个兄弟节点的前面加上新的节点
  },
  before (oldNode, newNode) {
    oldNode.parentNode.insertBefore(newNode, oldNode)
  },
  append (parent, node) {
    parent.appendChild(node)
  },
  wrap (node, child) {
    //div1         div1        div1
    //----div2     ----div3    ----div3    
    //             ----div2    --------div2
    //所以要先在div2的前面创建一个兄弟节点，之后将自己变成这个节点的儿子
    dom.before(node, child)
    dom.append(child, node)
  },
  remove (node) {
    node.parentNode.removeChild(node)
    return node
  },

  //用于删除一个节点的所有后代
  empty (node) {
    const arr = []
    let x = node.firstChild
    while (x) {
      arr.push(dom.remove(node.firstChild))
      x = node.firstChild
    }
    return arr
  },

  //用于读写属性
  attr (node, name, value) {
    if (arguments.length === 3) {
      //设置属性
      node.setAttribute(name, value)
    } else if (arguments.length === 2) {
      //读取属性
      return node.getAttribute(name)
    }
  },

  //用于读写文本内容
  text (node, string) {
    if (arguments.length === 2) {
      if ('innerText' in node) {
        node.innerText = string  //ie
      } else {
        node.textContent = string //chrome/firefox
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        return node.innerText  //ie
      } else {
        return node.textContent //chrome/firefox
      }
    }
  },

  //用于读写HTML内容
  html (node, string) {
    if (arguments.length === 2) {

      node.innerHTML = string
    } else if (arguments.length === 1) {
      return node.innerHTML
    }
  },

  //用于读写style样式
  style (node, name, value) {
    if (arguments.length === 3) {
      //dom.style(div,'color','red')
      node.style[name] = value
    } else if (arguments.length === 2) {
      if (typeof name === 'string') {
        //dom.style(div,'color')
        return node.style[name]
      } else if (name instanceof Object) {
        //dom.style(div,{color:'red'})
        for (let key in name) {
          node.style[key] = name[key]
        }
      }
    }
  },
  class: {
    add (node, className) {
      node.classList.add(className)
    },
    remove (node, className) {
      node.classList.remove(className)
    },
    has (node, className) {
      return node.classList.contains(className)
    }
  },

  on (node, eventName, fn) {
    node.addEventListener(eventName, fn)
  },
  off (node, eventName, fn) {
    node.removeEventListener(eventName, fn)
  },

  find (selector, scope) {
    //scope在指定范围查找
    return (scope || document).querySelectorAll(selector)
  },
  parent (node) {
    return node.parentNode
  },
  children (node) {
    return node.children
  },
  siblings (node) {
    return Array.from(node.parentNode.children).filter(n => n !== node)
  },
  next (node) {
    let x = node.nextSibling
    while (x && x.nodeType === 3) {
      x = x.nextSibling
    }
    return x
  },

  previous (node) {
    let x = node.previousSibling
    while (x && x.nodeType === 3) {
      x = x.previousSibling
    }
    return x
  },

  //遍历
  each (nodeList, fn) {
    for (let i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i])
    }
  },
  index (node) {
    const list = dom.children(node.parentNode)
    let i
    for (i = 0; i < list.length; i++) {
      if (list[i] === node) {
        break
      }
    }
    return i
  }
};

