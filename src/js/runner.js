import status from './status'
import store from './menu.store'

let getMethod = function (methodName) {
  return function (name, callback) {
    // Check arguments
    if (typeof name === 'function') {
      callback = name
      name = 'sidr'
    } else if (!name) {
      name = 'sidr'
    }

    let menu = store.get(name)
    menu[methodName](callback)
  }
}

let methods = {}
let publicMethods = ['open', 'close', 'toggle', 'reload']
for (let i = 0; i < publicMethods.length; i++) {
  let methodName = publicMethods[i]
  methods[methodName] = getMethod(methodName)
}

function runner (method) {
  if (method === 'status') {
    return status
  } else if (methods[method]) {
    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
  } else if (typeof method === 'function' || typeof method === 'string' || !method) {
    return methods.toggle.apply(this, arguments)
  } else {
    console.error('Method ' + method + ' does not exist on sidr')
  }
}

export default runner
