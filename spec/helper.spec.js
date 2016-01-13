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
    });
});
