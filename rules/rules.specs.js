let sut;

module.exports = describe('localizable', () => {
    before(() => {
        sut = require('../');
    });

    describe('ensureRequiredProperties', () => {

        it('should return the correct String localized', () => {
            sut.ensureRequiredProperties(data, ['toto'])(context)
                .should.deep.equal(true);

        });
    });
});

let data = {
    toto : "toto"
}

let context = {
    data
}
