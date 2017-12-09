import utils from '../../src/js/utils/utils'

describe('utils.js', () => {
  describe('#isUrl()', () => {
    it('should not identify a number as a URL', () => {
      utils.isUrl(4).should.equal(false)
    })
    it('should not identify a non-URL string as a URL', () => {
      utils.isUrl('http:whatever.com/yeah').should.equal(false)
    })
    it('should not identify an object as a URL', () => {
      utils.isUrl({
        foo: 'bar'
      }).should.equal(false)
    })
    it('should not identify an array as a URL', () => {
      utils.isUrl([1, 2]).should.equal(false)
    })
    it('should identify a URL with only a domain', () => {
      utils.isUrl('http://whatever.com').should.equal(true)
    })
    it('should identify a https URL', () => {
      utils.isUrl('https://whatever.info').should.equal(true)
    })
    it('should identify a URL with a long path', () => {
      utils.isUrl('http://whatever.eus/foo/bar/hey').should.equal(true)
    })
    it('should identify a URL with a long path and query params', () => {
      utils.isUrl('http://whatever.com/foo/bar/hey.html?hey=ho&me&you=ok').should.equal(true)
    })
    it('should identify a URL with a long path and query params and the port', () => {
      utils.isUrl('http://whatever.com:9000/foo/bar/hey.html?hey=ho&me&you=ok').should.equal(true)
    })
  })

  describe('#extend()', () => {
    it('should merge properties from the second object into the first one', () => {
      utils.extend({
        test: 1,
        acme: 'what'
      }, {
        acme: 'where',
        other: 'why'
      }).should.eql({
        test: 1,
        acme: 'where',
        other: 'why'
      })
    })
    it('should keep the default options if empty object is passed', () => {
      utils.extend({test: 1}, {}).should.eql({test: 1})
    })
    it('should keep the options object if empty default options passed', () => {
      utils.extend({}, {test: 1}).should.eql({test: 1})
    })
  })

  describe('#fetch()', () => {
    let xhr
    let requests

    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest()

      requests = []
      xhr.onCreate = (xhr) => {
        requests.push(xhr)
      }
    })

    afterEach(() => {
      xhr.restore()
    })

    it('should make a get AJAX request and execute callback with the given content', (done) => {
      utils.fetch('http://www.google.com/', (data) => {
        data.should.equal('{"hola":"adios"}')
        done()
      })

      requests[0].respond(200, { 'Content-Type': 'text/json' }, '{"hola":"adios"}')
    })
  })
})
