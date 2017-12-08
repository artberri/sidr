import dom from '../utils/dom'

const bodyAnimationClass = 'sidr-animating'
const openAction = 'open'

class Body {
  constructor (settings, menuWidth) {
    this.name = settings.name
    this.item = dom.qs(settings.body)
    this.side = settings.side
    this.speed = settings.speed
    this.timing = settings.timing
    this.displace = settings.displace
    this.menuWidth = menuWidth
  }

  prepare (action) {
    var prop = (action === openAction) ? 'hidden' : ''

    // Prepare page if container is body
    if (this.item.tagName === 'BODY') {
      let html = dom.qs('html')
      let scrollTop = html.scrollTop

      html.style.overflowX = prop
      html.scrollTop = scrollTop
    }
  }

  unprepare () {
    if (this.item.tagName === 'BODY') {
      let html = dom.qs('html')
      html.style.overflowX = ''
    }
  }

  move (action) {
    this.item.classList.add(bodyAnimationClass)
    if (action === openAction) {
      this.open()
    } else {
      this.close()
    }
  }

  open () {
    if (this.displace) {
      let transitions = dom.transitions
      let item = this.item

      item.style[transitions.cssProperty] = this.side + ' ' + (this.speed / 1000) + 's ' + this.timing
      item.style[this.side] = 0
      item.style.width = item.offsetWidth + 'px'
      item.style.position = 'absolute'
      item.style[this.side] = this.menuWidth + 'px'
    }
  }

  onClose () {
    let transitions = dom.transitions
    let item = this.item

    item.style[transitions.cssProperty] = ''
    item.style.right = ''
    item.style.left = ''
    item.style.width = ''
    item.style.position = ''

    dom.unbind(item, transitions.event, this.temporalCallback)
  }

  close () {
    if (this.displace) {
      let transitions = dom.transitions
      let item = this.item

      item.style[this.side] = 0
      let self = this
      this.temporalCallback = () => {
        self.onClose()
      }
      dom.bind(item, transitions.event, this.temporalCallback)
    }
  }

  removeAnimationClass () {
    this.item.classList.remove(bodyAnimationClass)
  }

  removeOpenClass () {
    this.item.classList.remove('sidr-open')
    if (this.name !== 'sidr') {
      this.item.classList.remove(this.name + '-open')
    }
  }

  addOpenClass () {
    this.item.classList.add('sidr-open')
    if (this.name !== 'sidr') {
      this.item.classList.add(this.name + '-open')
    }
  }
}

export default Body
