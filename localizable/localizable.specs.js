let sut;

module.export = describe('localizable', () => {
    before(() => {
        sut = require('./localizable')(messages);
    });

    describe('getMessage', () => {
        it('should return the correct String localized', () => {
            sut.getMessage('test.test', 'fr', "René")
                .should.deep.equal("Salut René, tu vas bien René?");
            sut.getMessage('test.test', 'fr')
                .should.deep.equal("Salut ${0}, tu vas bien ${0}?");
            sut.getMessage('test.test', 'en', "Bob")
                .should.deep.equal("Hello Bob, are you ok Bob?");
            sut.getMessage('test.test', 'wrong')
                .should.deep.equal("test.test");
            sut.getMessage('test.test', 'super', ['bala', 'segue'])
                .should.deep.equal("Hello bala, segue, bala");
        });
    });
});

let messages = {
    'test.test': {
        fr: 'Salut ${0}, tu vas bien ${0}?',
        en: 'Hello ${0}, are you ok ${0}?',
        wrong: 'Hello ${0}, are you ok ${0)?',
        super: 'Hello ${0}, ${1}, ${0}'
    }
}
