import store from '../src/js/menu.store'

describe('menu.store.js', () => {
  describe('#add()', () => {
    it('should allow adding items', () => {
      store.add('test-key', 'test-value')
      store.get('test-key').should.equal('test-value')
    })
  })
  describe('#get()', () => {
    it('should allow getting existing elements', () => {
      store.add('test-key2', 'test-value2')
      store.get('test-key2').should.equal('test-value2')
    })
    it('should return undefined if the element does not exist', () => {
      should.not.exist(store.get('test-key3'))
    })
  })
})
