import runner from '../runner'
import BaseElement from './base.element'

class Button extends BaseElement {
  constructor (element, settings) {
    super(element)
    this.init(settings)
  }

  init (settings) {
    let data = this.element.getAttribute('data-sidr')

    // If the plugin hasn't been initialized yet
    if (!data) {
      let name = settings.name
      let method = settings.method
      let bind = settings.bind

      this.element.setAttribute('data-sidr', name)
      this.bind(bind, function (event) {
        event.preventDefault()

        runner(method, name)
      })
    }
  }
}

export default Button
