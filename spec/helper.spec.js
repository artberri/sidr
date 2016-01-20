import helper from '../src/js/helper';

describe('helper.js', () => {
    describe('#isUrl()', () => {
        it('should not identify a number as a URL', () => {
            helper.isUrl(4).should.equal(false);
        });
        it('should not identify a non-URL string as a URL', () => {
            helper.isUrl('http:whatever.com/yeah').should.equal(false);
        });
        it('should not identify an object as a URL', () => {
            helper.isUrl({
                foo: 'bar'
            }).should.equal(false);
        });
        it('should not identify an array as a URL', () => {
            helper.isUrl([1, 2]).should.equal(false);
        });
        it('should identify a URL with only a domain', () => {
            helper.isUrl('http://whatever.com').should.equal(true);
        });
        it('should identify a https URL', () => {
            helper.isUrl('https://whatever.info').should.equal(true);
        });
        it('should identify a URL with a long path', () => {
            helper.isUrl('http://whatever.eus/foo/bar/hey').should.equal(true);
        });
        it('should identify a URL with a long path and query params', () => {
            helper.isUrl('http://whatever.com/foo/bar/hey.html?hey=ho&me&you=ok').should.equal(true);
        });
        it('should identify a URL with a long path and query params and the port', () => {
            helper.isUrl('http://whatever.com:9000/foo/bar/hey.html?hey=ho&me&you=ok').should.equal(true);
        });
    });

    describe('#addPrefixes()', () => {
        var $element = {};

        beforeEach(() => {
            $element.removeAttr = sinon.spy();
            sinon.stub(helper, 'addPrefix');
        });

        afterEach(() => {
            helper.addPrefix.restore();
        });

        it('should replace the id attribute', () => {
            helper.addPrefixes($element);

            helper.addPrefix.calledWith($element, 'id').should.equal(true);
        });
        it('should replace the class attribute', () => {
            helper.addPrefixes($element);

            helper.addPrefix.calledWith($element, 'class').should.equal(true);
        });
        it('should remove the style attribute', () => {
            helper.addPrefixes($element);

            $element.removeAttr.calledWith('style').should.equal(true);
        });
    });

    describe('#addPrefix()', () => {
        var $element = {};

        it('should do nothing if is not a string', () => {
            $element.attr = sinon.stub().returns(true);
            helper.addPrefix($element, 'attribute');

            $element.attr.calledOnce.should.equal(true);
        });
        it('should do nothing if is an empty string', () => {
            $element.attr = sinon.stub().returns('');
            helper.addPrefix($element, 'attribute');

            $element.attr.calledOnce.should.equal(true);
        });
        it('should do nothing if the attribute is sidr-inner', () => {
            $element.attr = sinon.stub().returns('sidr-inner');
            helper.addPrefix($element, 'attribute');

            $element.attr.calledOnce.should.equal(true);
        });
        it('should add the proper prefixes to any other string', () => {
            $element.attr = sinon.stub().returns('myclass my-second-class');
            helper.addPrefix($element, 'attribute');

            $element.attr.calledWith('attribute', 'sidr-attribute-myclass sidr-attribute-my-second-class').should.equal(true);
        });
    });
});
