import Menu from '../src/js/menu';

var $ = jQuery;

describe('menu.js', () => {
    var m;

    describe('#constructor()', () => {
        before(() => {
            $('<div />')
              .attr('id', 'sidr')
              .data('speed', 'speed')
              .data('side', 'side')
              .data('displace', 'displace')
              .data('onOpen', 'onOpen')
              .data('onClose', 'onClose')
              .data('body', 'body')
              .width(200)
              .appendTo($('body'));
        });

        it('should set the name property with the parameter passed', () => {
            m = new Menu('sidr');

            m.name.should.equal('sidr');
        });
        it('should set the item property with the jQuery element with id equals name', () => {
            m = new Menu('sidr');

            m.item.attr('id').should.be.equal('sidr');
        });
        it('should set the sidr open class that will be added to body', () => {
            m = new Menu('sidr');

            m.openClass.should.be.equal('sidr-open');
        });
        it('should set the menuWidth property with the other width of the menu element', () => {
            m = new Menu('sidr');

            m.menuWidth.should.be.equal(200);
        });
        it('should set the speed property with the speed data property of the menu element', () => {
            m = new Menu('sidr');

            m.speed.should.be.equal('speed');
        });
        it('should set the side property with the side data property of the menu element', () => {
            m = new Menu('sidr');

            m.side.should.be.equal('side');
        });
        it('should set the displace property with the displace data property of the menu element', () => {
            m = new Menu('sidr');

            m.displace.should.be.equal('displace');
        });
        it('should set the onOpen property with the onOpen data property of the menu element', () => {
            m = new Menu('sidr');

            m.onOpen.should.be.equal('onOpen');
        });
        it('should set the onClose property with the onClose data property of the menu element', () => {
            m = new Menu('sidr');

            m.onClose.should.be.equal('onClose');
        });
        it('should set the body property with the jquery element using the body data property of the menu element as selector', () => {
            m = new Menu('sidr');

            m.body.prop('tagName').should.be.equal('BODY');
        });

        describe('when the name is not "sidr"', () => {
            before(() => {
                $('#sidr')
                  .attr('id', 'nosidr');
            });

            it('should set the sidr open class that will be added to body', () => {
                m = new Menu('nosidr');

                m.openClass.should.be.equal('sidr-open nosidr-open');
            });
        });
    });

    describe('#getAnimation()', () => {
        var animation,
            element;

        beforeEach(() => {
            m = new Menu('sidr');
            m.menuWidth = 200;
        });

        describe('when is a left menu', () => {
            beforeEach(() => {
                m.side = 'left';
            });

            describe('and the element is the menu', () => {
                before(() => {
                    element = 'menu';
                });

                it('should set left property to 0 when open', () => {
                    animation = m.getAnimation('open', element);

                    animation.should.deep.equal({
                        left: 0
                    });
                });
                it('should set left property to the menuWidth when close', () => {
                    animation = m.getAnimation('close', element);

                    animation.should.deep.equal({
                        left: '-200px'
                    });
                });
            });

            describe('and the element is the body', () => {
                before(() => {
                    element = 'body';
                });

                it('should set left property to the menuWidth when open', () => {
                    animation = m.getAnimation('open', element);

                    animation.should.deep.equal({
                        left: '200px'
                    });
                });
                it('should set left property to 0 when close', () => {
                    animation = m.getAnimation('close', element);

                    animation.should.deep.equal({
                        left: 0
                    });
                });
            });
        });


        describe('when is a right menu', () => {
            beforeEach(() => {
                m.side = 'right';
            });

            describe('and the element is the menu', () => {
                before(() => {
                    element = 'menu';
                });

                it('should set right property to 0 when open', () => {
                    animation = m.getAnimation('open', element);

                    animation.should.deep.equal({
                        right: 0
                    });
                });
                it('should set right property to the menuWidth when close', () => {
                    animation = m.getAnimation('close', element);

                    animation.should.deep.equal({
                        right: '-200px'
                    });
                });
            });

            describe('and the element is the body', () => {
                before(() => {
                    element = 'body';
                });

                it('should set right property to the menuWidth when open', () => {
                    animation = m.getAnimation('open', element);

                    animation.should.deep.equal({
                        right: '200px'
                    });
                });
                it('should set right property to 0 when close', () => {
                    animation = m.getAnimation('close', element);

                    animation.should.deep.equal({
                        right: 0
                    });
                });
            });
        });
    });
});
