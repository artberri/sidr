import BaseElement from '../../src/js/models/base.element'

function triggerEvent (el, eventName) {
  let event
  if (window.CustomEvent) {
    event = new CustomEvent(eventName)
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, true, true)
  }
  el.dispatchEvent(event)
}

describe('dom.js', () => {
  let sandbox = sinon.sandbox.create()
  let baseElement

  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style = ''
    let elem = document.createElement('div')
    document.body.appendChild(elem)
    baseElement = new BaseElement(elem)
  })

  afterEach(() => {
    sandbox.restore()
    document.body.innerHTML = ''
    document.body.style = ''
  })

  describe('#bind()', () => {
    it('should allow binding callbacks events', () => {
      let spy = sandbox.spy()
      baseElement.bind('click', spy)

      triggerEvent(baseElement.element, 'click')

      sandbox.assert.calledOnce(spy)
    })
  })

  describe('#unbind()', () => {
    it('should allow unbinding callbacks events', () => {
      let spy = sandbox.spy()
      baseElement.element.addEventListener('click', spy, false)

      baseElement.unbind('click', spy)

      triggerEvent(baseElement.element, 'click')

      sandbox.assert.neverCalledWith(spy)
    })
  })

  describe('#style()', () => {
    describe('when it is called with two arguments', () => {
      it('should set the provided style property', () => {
        baseElement.element.style.width = '100px'

        baseElement.style('width', '200px')

        baseElement.element.style.width.should.equal('200px')
      })
    })
    describe('when it is called with one argument', () => {
      it('should set the provided style based on the key-value object', () => {
        baseElement.element.style.width = '100px'
        baseElement.element.style.height = '100px'

        baseElement.style({
          width: '200px',
          height: '200px'
        })

        baseElement.element.style.width.should.equal('200px')
        baseElement.element.style.height.should.equal('200px')
      })
    })
  })

  describe('#addClass()', () => {
    it('should add classes to the element', () => {
      baseElement.element.setAttribute('class', 'previous')

      baseElement.addClass('class1 class2')

      baseElement.element.getAttribute('class').should.equal('previous class1 class2')
    })
  })

  describe('#removeClass()', () => {
    it('should remove classes from the element', () => {
      baseElement.element.setAttribute('class', 'class1 previous class2')

      baseElement.removeClass('class1 class2')

      baseElement.element.getAttribute('class').should.equal('previous')
    })
  })

  describe('#html()', () => {
    describe('when it is called with one argument', () => {
      it('should replace the html of the element', () => {
        baseElement.element.innerHTML = 'old'

        baseElement.html('new')

        baseElement.element.innerHTML.should.equal('new')
      })
    })

    describe('when it is called without arguments', () => {
      it('should retrieve the html of the element', () => {
        baseElement.element.innerHTML = 'old'

        let html = baseElement.html()

        html.should.equal('old')
      })
    })
  })

  describe('#offsetWidth()', () => {
    it('should retrieve the offsetWidth of the element', () => {
      baseElement.element.style.width = '600px'

      let offsetWidth = baseElement.offsetWidth()

      offsetWidth.should.equal(600)
    })
  })
})
