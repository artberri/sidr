import execute from '../src/js/execute'
import store from '../src/js/menu.store'

describe('execute.js', () => {
  let sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
    document.body.innerHTML = ''
    document.body.style = ''
  })

  it('should get the proper menu', () => {
    let addStub = sandbox.stub(store, 'get').returns({
      open () {}
    })

    execute('open', 'sidr', 'acme')

    sandbox.assert.calledOnce(addStub)
    addStub.args[0][0].should.equal('sidr')
  })

  it('should execute open method', (done) => {
    sandbox.stub(store, 'get').returns({
      open (callback) {
        callback.should.equal('acme')
        done()
      }
    })

    execute('open', 'sidr', 'acme')
  })

  it('should execute close method', (done) => {
    sandbox.stub(store, 'get').returns({
      close (callback) {
        callback.should.equal('acme')
        done()
      }
    })

    execute('close', 'sidr', 'acme')
  })

  it('should execute toggle method', (done) => {
    sandbox.stub(store, 'get').returns({
      toggle (callback) {
        callback.should.equal('acme')
        done()
      }
    })

    execute('toggle', 'sidr', 'acme')
  })

  it('should not throw error whith unknown commands', () => {
    sandbox.stub(store, 'get')
    let consoleSpy = sandbox.spy(console, 'error')

    execute('unknown', 'sidr', 'acme')

    sandbox.assert.calledOnce(consoleSpy)
  })
})
