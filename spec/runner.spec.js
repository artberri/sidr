import store from '../src/js/menu.store'
import runner from '../src/js/runner'

describe('runner.js', () => {
  let sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
    document.body.innerHTML = ''
    document.body.style = ''
  })

  describe('status method', () => {
    it('should get the proper status', () => {
      let status = runner('status')

      status.moving.should.equal(false)
    })
  })

  describe('open method', () => {
    describe('when providing all parameters', () => {
      it('should run the open method with provided callback', (done) => {
        sandbox.stub(store, 'get').returns({
          open (callback) {
            callback.should.equal('acme')
            done()
          }
        })

        runner('open', 'sidr', 'acme')
      })
    })

    describe('when providing only the callback', () => {
      it('should run the open method with provided callback and default sidr menu', (done) => {
        let getStub = sandbox.stub(store, 'get').returns({
          open (callback) {
            callback()
            sandbox.assert.calledWith(getStub, 'sidr')
            sandbox.assert.calledOnce(sampleCallback)
            done()
          }
        })

        let sampleCallback = sandbox.spy()

        runner('open', sampleCallback)
      })
    })

    describe('whithout providing callback or menu name', () => {
      it('should run the open method with default sidr menu', (done) => {
        let getStub = sandbox.stub(store, 'get').returns({
          open () {
            done()
          }
        })

        runner('open')
        sandbox.assert.calledWith(getStub, 'sidr')
      })
    })
  })

  describe('close method', () => {
    it('should run the close method with provided callback', (done) => {
      sandbox.stub(store, 'get').returns({
        close (callback) {
          callback.should.equal('acme')
          done()
        }
      })

      runner('close', 'sidr', 'acme')
    })
  })

  describe('toggle method', () => {
    it('should run the toggle method with provided callback', (done) => {
      sandbox.stub(store, 'get').returns({
        toggle (callback) {
          callback.should.equal('acme')
          done()
        }
      })

      runner('toggle', 'sidr', 'acme')
    })
  })

  describe('reload method', () => {
    it('should run the reload method with provided callback', (done) => {
      sandbox.stub(store, 'get').returns({
        reload (callback) {
          callback.should.equal('acme')
          done()
        }
      })

      runner('reload', 'sidr', 'acme')
    })
  })

  describe('when only callback provided and not method provided', () => {
    it('should run the toggle method with provided callback in default sidr menu', (done) => {
      let getStub = sandbox.stub(store, 'get').returns({
        toggle (callback) {
          callback()
          sandbox.assert.calledWith(getStub, 'sidr')
          sandbox.assert.calledOnce(sampleCallback)
          done()
        }
      })

      let sampleCallback = sandbox.spy()

      runner(sampleCallback)
    })
  })

  describe('when nothing passed', () => {
    it('should run the toggle method in sidr menu', (done) => {
      let getStub = sandbox.stub(store, 'get').returns({
        toggle () {
          sandbox.assert.calledWith(getStub, 'sidr')
          done()
        }
      })

      runner()
    })
  })

  describe('when unknown arg passed', () => {
    it('should console an error', () => {
      let consoleSpy = sandbox.spy(console, 'error')
      sandbox.stub(store, 'get').returns({
        toggle () {}
      })

      runner([])
      sandbox.assert.calledOnce(consoleSpy)
    })
  })
})
