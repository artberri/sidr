import dom from './utils/dom'
import runner from './runner'

export default {
  init (selector, settings) {
    let buttons = dom.qsa(selector)
    for (let i = 0; i < buttons.length; i++) {
      this.addEvent(buttons[i], settings)
    }
  },

  addEvent (button, settings) {
    let data = button.getAttribute('data-sidr')

    // If the plugin hasn't been initialized yet
    if (!data) {
      let name = settings.name
      let bind = settings.bind
      let method = settings.method

      button.setAttribute('data-sidr', name)
      dom.bind(button, bind, function (event) {
        event.preventDefault()

        runner(method, name)
      })
    }
  }
}
