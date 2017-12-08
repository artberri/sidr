import defaultOptions from './default.options'
import store from './menu.store'
import utils from './utils/utils'
import Menu from './models/menu'
import events from './events'
import runner from './runner'

export default {
  new (selector, options) {
    let settings = utils.extend(defaultOptions, options)
    store.add(settings.name, new Menu(settings))
    events.init(selector, settings)
  },

  status () {
    return runner('status', ...arguments)
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
