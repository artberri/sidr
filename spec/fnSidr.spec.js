import fnSidr from '../src/js/jquery.fnSidr'
import store from '../src/js/menu.store'
import Menu from '../src/js/models/menu'
import events from '../src/js/events'

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
      sandbox.stub(events, 'addEvent')
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

    it('should call addEvent on each jquery element', (done) => {
      sandbox.stub(store, 'add')
      let addEventStub = sandbox.stub(events, 'addEvent')

      fnSidr.apply({
        each: (callback) => {
          callback()
          done()
        }
      }, {
        name: 'acme'
      })

      sandbox.assert.calledOnce(addEventStub)
    })
  })
})
