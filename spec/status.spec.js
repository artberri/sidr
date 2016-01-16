import status from '../src/js/status';

describe('status.js', () => {
    describe('#moving property', () => {
        it('should exist the moving property', () => {
            should.exist(status.moving);
        });
    });
    describe('#opened property', () => {
        it('should exist the opened property', () => {
            should.exist(status.opened);
        });
    });
});
