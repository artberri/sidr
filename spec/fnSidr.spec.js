import fnSidr from '../src/js/fnSidr';

describe('fnSidr.js', () => {
    var fn = {
        sidr: fnSidr
    };

    delete fn.sidr;
});
