import dom from '../../src/js/utils/dom'

describe('dom.js', () => {
  describe('#createMenu()', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should create a new div at the end of the body', () => {
      dom.createMenu('myid').should.equal(document.body.lastElementChild)
    })

    it('should create a new div with the given id', () => {
      dom.createMenu('myid').id.should.equal('myid')
    })
  })

  describe('#replaceHTML()', () => {
    it('should replace the html of an element', () => {
      let elem = document.createElement('div')
      elem.innerHTML = 'old'

      dom.replaceHTML(elem, 'new')
        .innerHTML.should.equal('new')
    })
  })

  describe('#getHTMLContent()', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="hello">Hola1</div>
        <div class="hello">Hola2</div>
        <div class="hello">Hola3</div>
        <div id="bye">Bye</div>
        <div id="hola"><p class="bye">Hello</p></div>
        <div>
          <p>Paragraph1</p>
          <p>Paragraph2</p>
        </div>
      `
    })
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should get multiple items matching same selector', () => {
      dom.getHTMLContent('.hello')
        .should.equal('<div class="sidr-inner">Hola1</div><div class="sidr-inner">Hola2</div><div class="sidr-inner">Hola3</div>')
    })
    it('should allow multiple selectors', () => {
      dom.getHTMLContent('#hola, p')
        .should.equal('<div class="sidr-inner"><p class="bye">Hello</p></div><div class="sidr-inner">Hello</div><div class="sidr-inner">Paragraph1</div><div class="sidr-inner">Paragraph2</div>')
    })
  })

  describe('#addPrefixes()', () => {
    it('should replace the id attribute', () => {
      dom.addPrefixes('<div id="hola"></div>')
        .should.equal('<div id="sidr-id-hola"></div>')
    })
    it('should replace the class attribute', () => {
      dom.addPrefixes('<ul class="hola adios"><span class="halo"></span></ul>')
        .should.equal('<ul class="sidr-class-hola sidr-class-adios"><span class="sidr-class-halo"></span></ul>')
    })
    it('should remove the style attribute', () => {
      dom.addPrefixes('<p style="text-align: center;"></p>')
        .should.equal('<p></p>')
    })
    it('should not change the sidr-inner class', () => {
      dom.addPrefixes('<div class="sidr-inner"></div>')
        .should.equal('<div class="sidr-inner"></div>')
    })
    it('should do all previous things together', () => {
      dom.addPrefixes(`
        <div class="sidr-inner">
          <div id="myid">
            <ul class="hello bye">
              <li>Hola</li>
              <li style="font-weight: bold;">Adios</li>
            </ul>
          </div>
        </div>
      `).should.equal(`
        <div class="sidr-inner">
          <div id="sidr-id-myid">
            <ul class="sidr-class-hello sidr-class-bye">
              <li>Hola</li>
              <li>Adios</li>
            </ul>
          </div>
        </div>
      `)
    })
  })

  describe('#transitions', () => {
    it('should return the browser transition capabilities', () => {
      dom.transitions.should.eql({
        cssProperty: 'transition',
        supported: true,
        property: 'transition',
        event: 'transitionend'
      })
    })
  })
})
