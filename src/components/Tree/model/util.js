export function isDef(v) {
  return v !== undefined && v !== null
}

export function isUndef(v) {
  return v === undefined || v === null
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

const _toString = Object.prototype.toString
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export const NODE_KEY = '$treeNodeId'

export const markNodeData = function (node, data) {
  if (!data || data[NODE_KEY]) return
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false
  })
}

export const getNodeKey = function (key, data) {
  if (!key) return data[NODE_KEY]
  return data[key]
}

export const findNearestComponent = (element, componentName) => {
  let target = element
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__
    }
    target = target.parentNode
  }
  return null
}

export function throttle(fn, delay = 500, context) {
  let timer = null
  return function (...args) {
    if (timer) return
    context = context || this
    timer = setTimeout(() => {
      timer = null
      fn.apply(context, args)
    }, delay)
  }
}

export function removeClass(el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.setAttribute('class', trim(curClass))
  }
}

export function hasClass(el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1)
    throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

export function addClass(el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.setAttribute('class', curClass)
  }
}
