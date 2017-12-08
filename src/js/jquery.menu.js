/* eslint callback-return: 0 */

import status from './status'
import helper from './helper'

var $ = jQuery

const bodyAnimationClass = 'sidr-animating'
const openAction = 'open'
const transitionEndEvent = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'

class Menu {
  constructor (name) {
    this.name = name
    this.item = $('#' + name)
    this.openClass = (name === 'sidr' ? 'sidr-open' : 'sidr-open ' + name + '-open')
    this.menuWidth = this.item.outerWidth(true)
    this.speed = this.item.data('speed')
    this.side = this.item.data('side')
    this.displace = this.item.data('displace')
    this.timing = this.item.data('timing')
    this.method = this.item.data('method')
    this.onOpenCallback = this.item.data('onOpen')
    this.onCloseCallback = this.item.data('onClose')
    this.onOpenEndCallback = this.item.data('onOpenEnd')
    this.onCloseEndCallback = this.item.data('onCloseEnd')
    this.body = $(this.item.data('body'))
  }

  prepareBody (action) {
    var prop = (action === 'open') ? 'hidden' : ''

    // Prepare page if container is body
    if (this.body.is('body')) {
      let $html = $('html')
      let scrollTop = $html.scrollTop()

      $html.css('overflow-x', prop).scrollTop(scrollTop)
    }
  }

  openBody () {
    if (this.displace) {
      let transitions = helper.transitions
      let $body = this.body

      $body.css(transitions.property, this.side + ' ' + (this.speed / 1000) + 's ' + this.timing)
        .css(this.side, 0)
        .css({
          width: $body.width(),
          position: 'absolute'
        })
      $body.css(this.side, this.menuWidth + 'px')
    }
  }

  onCloseBody () {
    let transitions = helper.transitions
    let resetStyles = {
      width: '',
      position: '',
      right: '',
      left: ''
    }

    resetStyles[transitions.property] = ''

    this.body.css(resetStyles)
      .unbind(transitionEndEvent)
  }

  closeBody () {
    if (this.displace) {
      this.body.css(this.side, 0)
        .one(transitionEndEvent, () => {
          this.onCloseBody()
        })
    }
  }

  moveBody (action) {
    if (action === openAction) {
      this.openBody()
    } else {
      this.closeBody()
    }
  }

  onOpenMenu (callback) {
    var name = this.name

    status.moving = false
    status.opened = name

    this.item.unbind(transitionEndEvent)

    this.body.removeClass(bodyAnimationClass)
      .addClass(this.openClass)

    this.onOpenEndCallback()

    if (typeof callback === 'function') {
      callback(name)
    }
  }

  openMenu (callback) {
    var $item = this.item

    $item.css(this.side, 0)
      .one(transitionEndEvent, () => {
        this.onOpenMenu(callback)
      })
  }

  onCloseMenu (callback) {
    this.item.css({
      left: '',
      right: ''
    }).unbind(transitionEndEvent)
    $('html').css('overflow-x', '')

    status.moving = false
    status.opened = false

    this.body.removeClass(bodyAnimationClass)
      .removeClass(this.openClass)

    this.onCloseEndCallback()

    // Callback
    if (typeof callback === 'function') {
      callback(name)
    }
  }

  closeMenu (callback) {
    var item = this.item

    item.css(this.side, '')
      .one(transitionEndEvent, () => {
        this.onCloseMenu(callback)
      })
  }

  moveMenu (action, callback) {
    this.body.addClass(bodyAnimationClass)

    if (action === openAction) {
      this.openMenu(callback)
    } else {
      this.closeMenu(callback)
    }
  }

  move (action, callback) {
    // Lock sidr
    status.moving = true

    this.prepareBody(action)
    this.moveBody(action)
    this.moveMenu(action, callback)
  }

  open (callback) {
    // Check if is already opened or moving
    if (status.opened === this.name || status.moving) {
      return
    }

    // If another menu opened close first
    if (status.opened !== false) {
      let alreadyOpenedMenu = new Menu(status.opened)

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
}

export default Menu
