import fnSidr from '../src/js/fnSidr';

var $ = jQuery;

$.fn.sidr = fnSidr;

describe('fnSidr.js', () => {
    describe('#fnSidr()', () => {
        var button;

        beforeEach(() => {
            $('body').html('');
            button = $('<a />')
                        .appendTo($('body'));
        });

        afterEach(() => {
            button.remove();
        });

        describe('when the sidr element does not exist', () => {
            it('should create a sidr div', () => {
                button.sidr();

                $('#sidr').prop('tagName').should.equal('DIV');
            });
        });

        describe('when the sidr element already exists', () => {
            var existentSidr;

            beforeEach(() => {
                existentSidr = $('<nav />')
                            .attr('id', 'sidr')
                            .appendTo($('body'));
            });

            it('should use the existent element', () => {
                button.sidr();

                existentSidr.data('speed').should.equal(200);
            });
        });

        describe('when no options are set', () => {
            it('should set the default speed', () => {
                button.sidr();

                $('#sidr').data('speed').should.equal(200);
            });
            it('should set the default side', () => {
                button.sidr();

                $('#sidr').data('side').should.equal('left');
            });
            it('should set the default body', () => {
                button.sidr();

                $('#sidr').data('body').should.equal('body');
            });
            it('should set the default displace', () => {
                button.sidr();

                $('#sidr').data('displace').should.equal(true);
            });
            it('should set the default timing', () => {
                button.sidr();

                $('#sidr').data('timing').should.equal('ease');
            });
            it('should set the default method', () => {
                button.sidr();

                $('#sidr').data('method').should.equal('toggle');
            });
        });

        describe('when options are set', () => {
            it('should accept custom speed', () => {
                button.sidr({
                    speed: 500
                });

                $('#sidr').data('speed').should.equal(500);
            });
            it('should accept custom side', () => {
                button.sidr({
                    side: 'right'
                });

                $('#sidr').data('side').should.equal('right');
            });
            it('should accept custom body', () => {
                button.sidr({
                    body: '.otherclass'
                });

                $('#sidr').data('body').should.equal('.otherclass');
            });
            it('should accept custom displace', () => {
                button.sidr({
                    displace: false
                });

                $('#sidr').data('displace').should.equal(false);
            });
            it('should accept custom timing', () => {
                button.sidr({
                    timing: 'ease-in-out'
                });

                $('#sidr').data('timing').should.equal('ease-in-out');
            });
            it('should accept custom method', () => {
                button.sidr({
                    method: 'open'
                });

                $('#sidr').data('method').should.equal('open');
            });
        });
    });
});
