import defaultOptions from './default.options'
import store from './menu.store'
import utils from './utils/utils'
import Menu from './models/menu'
import Button from './models/button'
import runner from './runner'
import dom from './utils/dom'

export default {
  new (selector, options) {
    let settings = utils.extend(defaultOptions, options)
    let buttons = dom.qsa(selector)

    store.add(settings.name, new Menu(settings))
    for (let i = 0; i < buttons.length; i++) {
      new Button(buttons[i], settings)
    }
  },

  status () {
    return runner('status', ...arguments)
  },

  reload () {
    return runner('reload', ...arguments)
  },

  close () {
    return runner('close', ...arguments)
  },

  open () {
    return runner('open', ...arguments)
  },

  toggle () {
    return runner('toggle', ...arguments)
  }
}
