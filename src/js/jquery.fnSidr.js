import utils from './utils/utils'
import Menu from './models/menu'
import Button from './models/button'
import store from './menu.store'
import defaultOptions from './default.options'

function fnSidr (options) {
  let settings = utils.extend(defaultOptions, options)
  store.add(settings.name, new Menu(settings))

  return this.each(function () {
    new Button(this, settings)
  })
}

export default fnSidr
