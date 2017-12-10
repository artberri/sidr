import fnSidr from '../src/js/jquery.fnSidr'
import store from '../src/js/menu.store'
import Menu from '../src/js/models/menu'
import Button from '../src/js/models/button'

describe('fnSidr.js', () => {
  describe('#fnSidr()', () => {
    let sandbox = sinon.sandbox.create()
    let items = []

    beforeEach(() => {
      sandbox.stub(Menu.prototype, 'init')
    })

    afterEach(() => {
      sandbox.restore()
      items = []
      document.body.innerHTML = ''
      document.body.style = ''
    })

    it('should add the new Menu to the menu store', () => {
      sandbox.stub(Button.prototype, 'init')
      let addStub = sandbox.stub(store, 'add').callsFake((name, menu) => {
        items.push(menu)
      })

      fnSidr.apply({
        each: () => {}
      }, {
        name: 'acme'
      })

      sandbox.assert.calledOnce(addStub)
      items.length.should.equal(1)
    })

    it('should create a button for each jquery element', (done) => {
      sandbox.stub(store, 'add')
      let buttonStub = sandbox.stub(Button.prototype, 'init')

      fnSidr.apply({
        each: (callback) => {
          callback()
          done()
        }
      }, {
        name: 'acme'
      })

      sandbox.assert.calledOnce(buttonStub)
    })
  })
})
