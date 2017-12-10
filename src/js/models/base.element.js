function changeClasses (element, action, classes) {
  let classesArray = classes.split(' ')
  for (let i = 0; i < classesArray.length; i++) {
    let newClass = classesArray[i].trim()
    element.classList[action](newClass)
  }
}

function setProperty (element, prop, value) {
  element[prop] = value
}

function getProperty (element, prop, value) {
  return element[prop]
}

class BaseElement {
  constructor (element) {
    this.element = element
  }

  bind (event, callback) {
    this.element.addEventListener(event, callback, false)
  }

  unbind (event, callback) {
    this.element.removeEventListener(event, callback, false)
  }

  style (property, value) {
    if (typeof property === 'string') {
      this.element.style[property] = value
    } else {
      for (let key in property) {
        if (property.hasOwnProperty(key)) {
          this.element.style[key] = property[key]
        }
      }
    }
  }

  addClass (classes) {
    changeClasses(this.element, 'add', classes)
  }

  removeClass (classes) {
    changeClasses(this.element, 'remove', classes)
  }

  html (value) {
    if (value) {
      setProperty(this.element, 'innerHTML', value)
    } else {
      return getProperty(this.element, 'innerHTML')
    }
  }

  scrollTop (value) {
    if (value) {
      setProperty(this.element, 'scrollTop', value)
    } else {
      return getProperty(this.element, 'scrollTop')
    }
  }

  offsetWidth () {
    return this.element.offsetWidth
  }
}

export default BaseElement
