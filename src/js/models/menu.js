import Body from './body'
import dom from '../utils/dom'
import utils from '../utils/utils'
import status from '../status'
import store from '../menu.store'

class Menu {
  constructor (settings) {
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
    let name = this.name
    let sideMenu = dom.id(name)

    // If the side menu do not exist create it
    if (!sideMenu) {
      sideMenu = dom.createMenu(name)
    }

    // Add transition to menu
    sideMenu.style[dom.transitions.cssProperty] = this.side + ' ' + (this.speed / 1000) + 's ' + this.timing
    // Add required classes
    sideMenu.classList.add('sidr')
    sideMenu.classList.add('sidr-' + this.side)

    this.item = sideMenu
    this.fillWithContent()
    this.body = new Body(settings, this.item.offsetWidth)
  }

  fillWithContent () {
    if (typeof this.source === 'function') {
      let newContent = this.source(name)
      dom.replaceHTML(this.item, newContent)
    } else if (typeof this.source === 'string' && utils.isUrl(this.source)) {
      utils.fetch(this.source, (newContent) => {
        dom.replaceHTML(this.item, newContent)
      })
    } else if (typeof this.source === 'string') {
      let htmlContent = dom.getHTMLContent(this.source)

      if (this.renaming) {
        htmlContent = dom.addPrefixes(htmlContent)
      }

      dom.replaceHTML(this.item, htmlContent)
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

    // onOpen callback
    this.onOpenCallback()
  }

  close (callback) {
    // Check if is already closed or moving
    if (status.opened !== this.name || status.moving) {
      return
    }

    this.move('close', callback)

    // onClose callback
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
    var name = this.name

    status.moving = false
    status.opened = name

    dom.unbind(this.item, dom.transitions.event, this.temporalOpenMenuCallback)

    this.body.removeAnimationClass()
    this.body.addOpenClass()

    this.onOpenEndCallback()

    if (typeof callback === 'function') {
      callback(name)
    }
  }

  openMenu (callback) {
    let item = this.item

    item.style[this.side] = 0
    let self = this
    this.temporalOpenMenuCallback = () => {
      self.onOpenMenu(callback)
    }
    dom.bind(item, dom.transitions.event, this.temporalOpenMenuCallback)
  }

  onCloseMenu (callback) {
    let item = this.item

    dom.unbind(item, dom.transitions.event, this.temporalCloseMenuCallback)
    item.style.left = ''
    item.style.right = ''
    this.body.unprepare()

    status.moving = false
    status.opened = false

    this.body.removeAnimationClass()
    this.body.removeOpenClass()

    this.onCloseEndCallback()

    // Callback
    if (typeof callback === 'function') {
      callback(name)
    }
  }

  closeMenu (callback) {
    var item = this.item

    item.style[this.side] = ''

    let self = this
    this.temporalCloseMenuCallback = () => {
      self.onCloseMenu(callback)
    }
    dom.bind(item, dom.transitions.event, this.temporalCloseMenuCallback)
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
