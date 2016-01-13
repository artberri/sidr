import status from '../src/js/status';

describe('status.js', () => {
    describe('#moving parameter', () => {
        it('should be initialized to false', () => {
            status.moving.should.equal(false);
        });
    });
    describe('#opened parameter', () => {
        it('should be initialized to false', () => {
            status.opened.should.equal(false);
        });
    });
});
