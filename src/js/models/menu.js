import Body from './body'
import dom from '../utils/dom'
import utils from '../utils/utils'
import status from '../status'
import store from '../menu.store'
import BaseElement from './base.element'

class Menu extends BaseElement {
  constructor (settings) {
    super(dom.id(settings.name))

    this.name = settings.name
    this.speed = settings.speed
    this.side = settings.side
    this.displace = settings.displace
    this.source = settings.source
    this.timing = settings.timing
    this.method = settings.method
    this.renaming = settings.renaming
    this.onOpenCallback = settings.onOpen
    this.onCloseCallback = settings.onClose
    this.onOpenEndCallback = settings.onOpenEnd
    this.onCloseEndCallback = settings.onCloseEnd

    this.init(settings)
  }

  init (settings) {
    // If the side menu do not exist create it
    if (!this.element) {
      this.element = dom.createElement(this.name)
    }

    this.style(dom.transitions.cssProperty, this.side + ' ' + (this.speed / 1000) + 's ' + this.timing)
    this.addClass('sidr sidr-' + this.side)
    this.body = new Body(settings, this.offsetWidth())

    this.reload()
  }

  reload () {
    if (typeof this.source === 'function') {
      let newContent = this.source(name)
      this.html(newContent)
    } else if (typeof this.source === 'string' && utils.isUrl(this.source)) {
      utils.fetch(this.source, (newContent) => {
        this.html(newContent)
      })
    } else if (typeof this.source === 'string') {
      let htmlContent = dom.getHTMLContent(this.source)

      if (this.renaming) {
        htmlContent = dom.addPrefixes(htmlContent)
      }

      this.html(htmlContent)
    } else if (this.source !== null) {
      console.error('Invalid Sidr Source')
    }
  }

  move (action, callback) {
    // Lock sidr
    status.moving = true

    this.body.prepare(action)
    this.body.move(action)
    this.moveMenu(action, callback)
  }

  open (callback) {
    // Check if is already opened or moving
    if (status.opened === this.name || status.moving) {
      return
    }

    // If another menu opened close first
    if (status.opened !== false) {
      let alreadyOpenedMenu = store.get(status.opened)

      alreadyOpenedMenu.close(() => {
        this.open(callback)
      })

      return
    }

    this.move('open', callback)
    this.onOpenCallback()
  }

  close (callback) {
    // Check if is already closed or moving
    if (status.opened !== this.name || status.moving) {
      return
    }

    this.move('close', callback)
    this.onCloseCallback()
  }

  toggle (callback) {
    if (status.opened === this.name) {
      this.close(callback)
    } else {
      this.open(callback)
    }
  }

  onOpenMenu (callback) {
    let name = this.name

    status.moving = false
    status.opened = name

    this.unbind(dom.transitions.event, this.temporalOpenMenuCallback)
    this.body.removeAnimationClass()
    this.body.addOpenClass()
    this.onOpenEndCallback()

    if (typeof callback === 'function') {
      callback(name)
    }
  }

  openMenu (callback) {
    let self = this

    this.style(this.side, 0)
    this.temporalOpenMenuCallback = () => {
      self.onOpenMenu(callback)
    }
    this.bind(dom.transitions.event, this.temporalOpenMenuCallback)
  }

  onCloseMenu (callback) {
    this.unbind(dom.transitions.event, this.temporalCloseMenuCallback)
    this.style({
      left: '',
      right: ''
    })
    this.body.unprepare()

    status.moving = false
    status.opened = false

    this.body.removeAnimationClass()
    this.body.removeOpenClass()
    this.onCloseEndCallback()
    if (typeof callback === 'function') {
      callback(name)
    }
  }

  closeMenu (callback) {
    let self = this

    this.style(this.side, '')
    this.temporalCloseMenuCallback = () => {
      self.onCloseMenu(callback)
    }
    this.bind(dom.transitions.event, this.temporalCloseMenuCallback)
  }

  moveMenu (action, callback) {
    if (action === 'open') {
      this.openMenu(callback)
    } else {
      this.closeMenu(callback)
    }
  }
}

export default Menu
