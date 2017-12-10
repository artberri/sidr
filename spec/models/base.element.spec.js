import BaseElement from '../../src/js/models/base.element'

describe('dom.js', () => {
  let sandbox = sinon.sandbox.create()
  let baseElement

  beforeEach(() => {
    baseElement = new BaseElement(document.createElement('div'))
    document.body.innerHTML = ''
    document.body.style = ''
  })

  afterEach(() => {
    sandbox.restore()
    document.body.innerHTML = ''
    document.body.style = ''
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

        baseElement.html()

        baseElement.element.innerHTML.should.equal('old')
      })
    })
  })
})
