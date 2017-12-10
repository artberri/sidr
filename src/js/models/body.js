import dom from '../utils/dom'
import BaseElement from './base.element'

const bodyAnimationClass = 'sidr-animating'
const openAction = 'open'

function isBody (element) {
  return element.tagName === 'BODY'
}

function openClasses (name) {
  let classes = 'sidr-open'

  if (name !== 'sidr') {
    classes += ' ' + name + '-open'
  }

  return classes
}

class Body extends BaseElement {
  constructor (settings, menuWidth) {
    super(dom.qs(settings.body))

    this.name = settings.name
    this.side = settings.side
    this.speed = settings.speed
    this.timing = settings.timing
    this.displace = settings.displace
    this.menuWidth = menuWidth
  }

  prepare (action) {
    var prop = (action === openAction) ? 'hidden' : ''

    // Prepare page if container is body
    if (isBody(this.element)) {
      let html = new BaseElement(dom.qs('html'))
      let scrollTop = html.scrollTop()
      html.style('overflowX', prop)
      html.scrollTop(scrollTop)
    }
  }

  unprepare () {
    if (isBody(this.element)) {
      let html = new BaseElement(dom.qs('html'))
      html.style('overflowX', '')
    }
  }

  move (action) {
    this.addClass(bodyAnimationClass)
    if (action === openAction) {
      this.open()
    } else {
      this.close()
    }
  }

  open () {
    if (this.displace) {
      let transitions = dom.transitions
      let styles = {
        width: this.offsetWidth() + 'px',
        position: 'absolute'
      }
      this.style(this.side, '0')
      this.style(transitions.cssProperty, this.side + ' ' + (this.speed / 1000) + 's ' + this.timing)
      this.style(styles)
      setTimeout(() => this.style(this.side, this.menuWidth + 'px'), 1)
    }
  }

  onClose () {
    let transitions = dom.transitions
    let styles = {
      width: '',
      position: '',
      right: '',
      left: ''
    }

    styles[transitions.cssProperty] = ''
    this.style(styles)
    this.unbind(transitions.event, this.temporalCallback)
  }

  close () {
    if (this.displace) {
      let transitions = dom.transitions

      this.style(this.side, 0)
      let self = this
      this.temporalCallback = () => {
        self.onClose()
      }
      this.bind(transitions.event, this.temporalCallback)
    }
  }

  removeAnimationClass () {
    this.removeClass(bodyAnimationClass)
  }

  removeOpenClass () {
    this.removeClass(openClasses(this.name))
  }

  addOpenClass () {
    this.addClass(openClasses(this.name))
  }
}

export default Body
