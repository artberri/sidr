import utils from './utils/utils'
import Menu from './models/menu'
import store from './menu.store'
import events from './events'
import defaultOptions from './default.options'

function fnSidr (options) {
  let settings = utils.extend(defaultOptions, options)
  store.add(settings.name, new Menu(settings))

  return this.each(function () {
    events.addEvent(this, settings)
  })
}

export default fnSidr
