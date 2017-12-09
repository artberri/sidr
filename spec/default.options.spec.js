import options from '../src/js/default.options.js'

describe('default.options.js', () => {
  describe('#name property', () => {
    it('should exist the name property and equal sidr', () => {
      options.name.should.equal('sidr')
    })
  })
  describe('#speed property', () => {
    it('should exist the speed property and equal 200', () => {
      options.speed.should.equal(200)
    })
  })
  describe('#side property', () => {
    it('should exist the side property and equal left', () => {
      options.side.should.equal('left')
    })
  })
  describe('#renaming property', () => {
    it('should exist the renaming property and equal true', () => {
      options.renaming.should.equal(true)
    })
  })
  describe('#body property', () => {
    it('should exist the body property and equal body', () => {
      options.body.should.equal('body')
    })
  })
  describe('#displace property', () => {
    it('should exist the displace property and equal true', () => {
      options.displace.should.equal(true)
    })
  })
  describe('#timing property', () => {
    it('should exist the timing property and equal ease', () => {
      options.timing.should.equal('ease')
    })
  })
  describe('#method property', () => {
    it('should exist the method property and equal toggle', () => {
      options.method.should.equal('toggle')
    })
  })
  describe('#bind property', () => {
    it('should exist the bind property and equal click', () => {
      options.bind.should.equal('click')
    })
  })
})
