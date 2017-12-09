function addPrefix (item, attribute) {
  let toReplace = item.getAttribute(attribute)

  if (typeof toReplace === 'string' && toReplace !== '' && toReplace !== 'sidr-inner') {
    item.setAttribute(attribute, toReplace.replace(/([A-Za-z0-9_.-]+)/g, 'sidr-' + attribute + '-$1'))
  }
}

export default {
  id (elementId) {
    return document.getElementById(elementId)
  },

  qs (selector) {
    return document.querySelector(selector)
  },

  qsa (selectors) {
    return document.querySelectorAll(selectors)
  },

  bind (element, event, callback) {
    element.addEventListener(event, callback, false)
  },

  unbind (element, event, callback) {
    element.removeEventListener(event, callback, false)
  },

  createMenu (elementId) {
    var elem = document.createElement('div')
    elem.id = elementId
    document.body.appendChild(elem)

    return elem
  },

  replaceHTML (element, content) {
    element.innerHTML = content

    return element
  },

  getHTMLContent (selectors) {
    let htmlContent = ''
    let items = this.qsa(selectors)

    for (let i = 0; i < items.length; i++) {
      htmlContent += '<div class="sidr-inner">' + items[i].innerHTML + '</div>'
    }

    return htmlContent
  },

  addPrefixes (htmlContent) {
    let elem = document.createElement('div')
    elem.innerHTML = htmlContent

    let items = elem.querySelectorAll('*')
    for (let i = 0; i < items.length; i++) {
      addPrefix(items[i], 'id')
      addPrefix(items[i], 'class')
      items[i].removeAttribute('style')
    }

    return elem.innerHTML
  },

  transitions: (function () {
    let body = document.body || document.documentElement
    let style = body.style
    let supported = false
    let property = 'transition'
    let cssProperty = 'transition'
    let event = 'transitionend'

    if (property in style) {
      supported = true
    } else {
      let prefixes = ['moz', 'webkit', 'o', 'ms']
      let prefix
      let i

      property = property.charAt(0).toUpperCase() + property.substr(1)
      supported = (function () {
        for (i = 0; i < prefixes.length; i++) {
          prefix = prefixes[i]
          if ((prefix + property) in style) {
            return true
          }
        }

        return false
      }())
      cssProperty = supported ? prefix + property : null
      property = supported ? '-' + prefix + '-' + property.toLowerCase() : null
      if (prefix === 'webkit') {
        event = 'webkitTransitionEnd'
      } else if (prefix === '0') {
        event = 'oTransitionEnd'
      }
    }

    return {
      cssProperty,
      supported,
      property,
      event
    }
  }())
}
